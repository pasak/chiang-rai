module.exports = new class WebController {
async index (req,res) {
    const FormControl = { 
        System:     'Web',
        Language:   (req.params.Language == null) ? 'th' : req.params.Language
    }

    res.render('Front/Web/index',{ FormControl })
} // index

} // WebController