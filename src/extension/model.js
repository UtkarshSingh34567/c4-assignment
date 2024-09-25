const mongoose = require('mongoose');

const MetricsSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    timestamp: { type: Date, required: true },
});

MetricsSchema.index({ domain: 1, timestamp: 1 }, { unique: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const Metric = mongoose.model('Metric', MetricsSchema);

module.exports = { User, Metric };
