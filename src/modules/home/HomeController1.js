const { getLabel } = require('../../librarys/Library')
    
module.exports = new class HomeController1 {

async home (req,res) {
    const User = req.session.User

    // console.log('home User ' + User.Role) // JSON.stringify(User))

    if (User) {
        const Label = getLabel(User.Language)

        const PermissionRole = ['Admin']

        if (PermissionRole.includes(User.Role)) {
            var FormControl = {
                System:         'Admin',
                BACKEND_URL:    process.env.BACKEND_URL, 
                Title:          process.env.BackTitle,
                Logo:           process.env.BackLogo
            }        
        
            res.render('home/Home',{ User, Label, FormControl })
        }
    } else {
        res.redirect('/back')
    }
} // home

async backup (req,res) {
    var fs = require('fs');
    var spawn = require('child_process').spawn;
    var wstream = fs.createWriteStream('public/uploads/' + process.env.BACKUP_KEY + 'chring-rai.sql');
    
    var mysqldump = spawn('mysqldump', [
        '--no-defaults',
        '-h'+process.env.DATABASE_HOST,
        '-u'+process.env.DATABASE_USER,
        '-p'+process.env.DATABASE_PASSWORD,
        process.env.DATABASE_NAME,
    ]);
    
    mysqldump
        .stdout
        .pipe(wstream)
        .on('finish', function () {
            console.log('Backup database completed')
        })
        .on('error', function (err) {
            console.log(err)
        });    

    res.send('Backup database successful')
} // backup

async zip (req,res) {
    const archiver = require('archiver');

    /**
     * @param {String} sourceDir: /some/folder/to/compress
     * @param {String} outPath: /path/to/created.zip
     * @returns {Promise}
     */
    function zipDirectory(sourceDir, outPath) {
      const archive = archiver('zip', { zlib: { level: 9 }});
      const fs = require('fs');
      const stream = fs.createWriteStream(outPath);
    
      return new Promise((resolve, reject) => {
        archive
          .directory(sourceDir, false)
          .on('error', err => reject(err))
          .pipe(stream)
        ;
    
        stream.on('close', () => resolve());
        archive.finalize();
      });
    }

    let result = await zipDirectory('public/uploads','public/downloads/uploads.zip')

    res.send(result)
} // zip

} // HomeController