const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.post('/', auth, async (req,res) => {
    const {title, description} = req.body;
    try{
        const task = new Task({ title, description, user: req.user.id});
        await task.save();
        res.status(201).json(task);
    }catch(error){

        res.status(500).json({msg: 'Server Error'});
    }
});

router.get('/', auth, async (req,res) => {
    try{
        const tasks = await Task.find({user: req.user.id});
        res.json(tasks);
    }catch(error){
        res.status(500).json({msg: 'Server Error'});
    }
});

router.put('/:id', auth, async (req,res) => {
    const { title, description, cmpleted} = req.body;
    try{
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id, user:req.user.id},
            {title, description, completed},
            {new: true}
        );
        if (!task) return res.status(404).json({msg: 'Task not found'});
        res.json(task);
    }catch(error){
        res.status(500).json({msg: 'Server Error'});
    }
    
});

router.delete('/:id', auth, async(req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, user:req.user.id});
        if (!task) return res.status(404).json({msg: 'Task not found'});
        res.json({msg: 'Task Deleted'});
    }catch(error){
        res.status(500).json({msg: 'Server Error'});
    }
});

module.exports = router;
