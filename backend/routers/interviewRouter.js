const express = require('express');
const Model = require('../models/interviewModel');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/add', verifyToken, (req, res) => {
    req.body.company = req.user._id;
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/join', verifyToken, (req, res) => {
    const { panelId, company } = req.body;

    if (!panelId || !company) {
        return res.status(400).json({ message: "Panel ID and Company are required" });
    }

    // Add company to the interview panel
    Model.findByIdAndUpdate(
        panelId,
        { $push: { panel: { company } } }, // Assuming 'panel' is an array in the model
        { new: true }
    )
        .then((result) => {
            if (!result) {
                return res.status(404).json({ message: "Panel not found" });
            }
            res.status(200).json({ message: "Successfully joined the panel", panel: result });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Error joining the panel", error: err });
        });
});

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getbycompany', verifyToken, (req, res) => {
    Model.find({ company: req.user._id })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;