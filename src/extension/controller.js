const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Metric } = require('./model');

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        console.log(newUser);

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        console.log(user);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey');
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error logging in' });
    }
};


const saveMetrics = async (req, res) => {
    try {
        const { metrics } = req.body; 

        await Metric.deleteMany({});

        const uniqueMetrics = Array.from(new Set(metrics.map(metric => metric.domain)))
            .map(domain => {
                return {
                    domain,
                    timestamp: new Date()
                };
            });

        await Metric.insertMany(uniqueMetrics);

        return res.status(200).json({ message: 'Metrics saved successfully' });
    } catch (error) {
        console.error('Error saving metrics:', error);
        return res.status(500).json({ error: 'Failed to save metrics' });
    }
};




const getAllMetrics = async (req, res) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);


    if (!authHeader) {
        return res.status(403).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; 
    console.log(token);


    jwt.verify(token, 'secretKey', async (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' }); 
        }

        try {
            const metrics = await Metric.find();
            res.json(metrics);
        } catch (error) {
            console.error('Error fetching metrics:', error); 
            res.status(400).json({ error: 'Error fetching metrics' });
        }
    });
};



module.exports = { registerUser, loginUser, saveMetrics, getAllMetrics };
