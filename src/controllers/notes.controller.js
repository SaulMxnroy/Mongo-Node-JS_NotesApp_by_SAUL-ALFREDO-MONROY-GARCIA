const notesCtrl = {}
const Note = require('../models/Note')

notesCtrl.renderNoteForm = (req, res) => {
    res.render('notes/new-note')
}

notesCtrl.createNewNote = async (req, res) => {
    const { title, description } = req.body;
    const newNote = new Note({ title, description })
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully!');
    res.redirect('/notes')
}

notesCtrl.renderNotes = async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: 'desc' });
    res.render('notes/all', { notes });
}

notesCtrl.renderEditForm = async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note.user != req.user.id) {
        req.flash('error_msg', 'Warning, an unauthorized access attempt has been detected to a profile registered in our system. This is punishable by computer security laws. Your IP address and MAC address have been recorded for future evidence.');
        return res.redirect('/notes');
    }
    res.render('notes/edit-note', { note });
}

notesCtrl.updateNote = async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description })
    req.flash('success_msg', 'Note Updated Successfully!');
    res.redirect('/notes');
}

notesCtrl.deleteNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Note Deleted Successfully!');
    res.redirect('/Notes');
}

module.exports = notesCtrl