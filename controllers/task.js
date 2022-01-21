const TaskModel = require("../models/task");
const task = require("../models/task");

exports.create = async (req, res) => {
    const SaveTask = new TaskModel(req.body)
    SaveTask.save((error, savedTask) => {
        if (error) throw error
        res.redirect("/created-task")
    })

};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await task.findByIdAndRemove(id);
        res.redirect("/created-task")
    } catch (e) {
        res.status(404).send({
            message: `could not delete task ID:${id}.`,
        });
    }
};

exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
      const Task = await task.findById(id);
      res.render('update', { id: id });
    } catch (e) {
      res.status(404).send({
        message: `could not find task ${id}.`,
      });
    }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try 
  {
    const Task = await task.updateOne({ _id: id }, req.body);
    res.redirect('/created-task');
  } catch (e) {
    res.status(404).send({
      message: `could not find task ${id}.`,
    });
  }
};