const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const placeRoutes = require('./routes/placeRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const allowedOrigins = process.env.CLIENT_URL
	? process.env.CLIENT_URL.split(',').map((url) => url.trim())
	: ['http://localhost:5173'];

const io = new Server(server, {
	cors: {
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin) || origin === 'http://localhost:5000' || origin === `http://localhost:${process.env.PORT || 5000}`) {
				callback(null, true);
			} else {
				callback(new Error('CORS policy violation'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
});

app.set('io', io);

const getPlaceRoomName = (placeId) => `place:${placeId}`;

const emitPlaceViewerCount = (placeId) => {
	const roomName = getPlaceRoomName(placeId);
	const room = io.sockets.adapter.rooms.get(roomName);
	const viewers = room ? room.size : 0;
	io.to(roomName).emit('place:viewers', { placeId, viewers });
	return viewers;
};

io.on('connection', (socket) => {
	socket.data.joinedPlaces = new Set();

	socket.on('join:place', (placeId) => {
		if (placeId) {
			const roomName = getPlaceRoomName(placeId);
			socket.join(roomName);
			socket.data.joinedPlaces.add(String(placeId));
			emitPlaceViewerCount(placeId);
		}
	});

	socket.on('leave:place', (placeId) => {
		if (placeId) {
			const roomName = getPlaceRoomName(placeId);
			socket.leave(roomName);
			socket.data.joinedPlaces.delete(String(placeId));
			emitPlaceViewerCount(placeId);
		}
	});

	socket.on('disconnecting', () => {
		const joinedPlaces = socket.data.joinedPlaces || new Set();
		joinedPlaces.forEach((placeId) => {
			emitPlaceViewerCount(placeId);
		});
	});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve frontend static files
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// SPA catch-all: serve index.html for all non-API routes
app.get('*', (req, res) => {
	res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));