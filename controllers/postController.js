const Posts = require('../models/postModel');
const multer = require('multer');
const path = require('path')



const storage = multer.diskStorage({
    destination: './public/uploads/post-pictures',
    filename: function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    },
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('postImage');

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if(extName && mimeType){
        return cb(null, true)
    }else{
        return cb("Only image uploads allowed!")
    }
}

const post_newPost = (req,res) => {
    upload(req,res,err => {
        if(err){
            console.log("yerror: ", err);
            req.flash('error', err);
            res.redirect('/');
    
        }else{
            if(req.file == undefined){
                console.log(req.body);
                
                const createNewPost = async () => {

                    if(req.body.newPost){
                        const postToPost = await new Posts({
                            post: req.body.newPost,
                            postedByID: req.user.id,
                            postedByName: req.user.username,
                            postLikes: null
                        })
                        const insertPost = await postToPost.save();

                    if(insertPost){
                        req.flash('success', 'Posted successfully!');
                        res.redirect('/');               
                    }
                    
                    }else{
                        req.flash('error', 'Post cannot be empty');
                        res.redirect('/');   
                    }
                }

            
                createNewPost();
            }else{
                console.log(req.body);
                console.log(req.file);
                const createNewPost = async () => {

                    if(req.body.newPost){
                        const postToPost = await new Posts({
                            post: req.body.newPost,
                            postedByID: req.user.id,
                            postedByName: req.user.username,
                            postImage: req.file.filename,
                            postLikes: 0
                        })
                        const insertPost = await postToPost.save();

                    if(insertPost){
                        req.flash('success', 'Posted successfully!');
                        res.redirect('/');               
                    }
                    
                    }else{
                        req.flash('error', 'Post cannot be empty');
                        res.redirect('/');   
                    }
                }
                createNewPost();
                
            }
        }   
    })
}

const delete_individualPost = (req,res) => {
    const {id} = req.params;

    console.log(id);

    Posts.findByIdAndDelete({_id:id})
        .then(suc=>{
            console.log("delete", suc);
            req.flash({'delete': 'Successfully Deleted'});
            res.json({redirect: '/my-posts'});
        })
}
module.exports = {
    post_newPost,
    delete_individualPost
}