const express = require('express');
const PostController = require('../controllers/postController');
const Posts = require('../models/postModel')
const User = require('../models/userModel')

// const findPost = (req,res) =>{ 

//     Posts.find()
//     .then(post=>{
//         post.sort((a, b) => b.createdAt - a.createdAt);
//         return (post);
//         // return({user: req.user, postArray: [...post]});
//     })

// }
var listOfPosts='';

async function getPosts(req, res, next){
    const post = await Posts.find();
    post.sort((a, b) => b.createdAt - a.createdAt);
    if(req.route.path == '/all-posts'){
        res.render('all-post', {user: req.user, postArray: [...post]});
    }else{
        console.log("Another")
        res.render('my-post', {user: req.user, postArray: [...post]});
    }
    return next();
}


const router = express.Router();

router.post('/create-new-post', PostController.post_newPost);
router.get('/all-posts', getPosts);
router.get('/my-posts', getPosts)
router.delete('/deletePost/:id', PostController.delete_individualPost);

router.put('/posts/increaseLike/:id', (req,res)=>{
    console.log(req.params);
    console.log(req.body)

    Posts.findOne({_id: req.params.id})
        .then(post=>{
            console.log(post);

            let postLikes = (post.postLikes);

            if(!postLikes){
                postLikes = `"${req.body.likedBy}"`
                console.log("ost likes filled");
            } else{

                let checkLikes = `[${postLikes}]`
                checkLikes = JSON.parse(checkLikes);


                console.log("CL", checkLikes);

                console.log(req.user.id);

                let hasLiked = checkLikes.filter((likedByUser)=>{
                    return likedByUser == req.user.id;
                })

                console.log("HL: ", hasLiked);

                if(hasLiked.length>0){
                    console.log("Already Liked");
                    console.log((hasLiked));

                    Posts.find({_id: req.params.id})
                        .then(post=>{
                            console.log(post);
                            console.log("--------");

                            let likeArray = JSON.parse(`[${post[0].postLikes}]`);
                            
                            console.log(likeArray);

                            let x = likeArray.filter(post=>{
                                return post !== req.user.id
                            })

                            let remainingLikes;
                            if(JSON.stringify(x)=='[]'){
                                remainingLikes= null
                            }else{
                                remainingLikes = JSON.stringify(x)
                            }

                            post[0].postLikes = remainingLikes;

                            Posts.findByIdAndUpdate({_id: req.params.id},{
                                postLikes: remainingLikes
                            }, {new: true}).then(suc=>{
                                console.log("Suc", suc);
                                res.json({likes: suc.postLikes})
                            })

                            // console.log("RL: ",remainingLikes, post[0].postLikes);
                        });




                    return;
                }else{
                postLikes= postLikes+`, "${req.body.likedBy}"`;
                }

            }
            const updateLikes = async() => {
                try{
                    const updt = await Posts.findByIdAndUpdate({_id:post._id}, {
                        postLikes: postLikes
                    }, {new: true})

                    if(await updt){
                    console.log(updt);
                    res.json({likes: updt.postLikes});
                    }
                }
                catch(e){
                    console.log(e);
                }
            }
            updateLikes();

           
        })
        .catch(e=>{
            console.log(e);
        })

})

module.exports = router;