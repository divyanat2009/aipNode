const express = require('express');
const xss = require('xss');
const path = require('path');
const PostsService = require('./posts-service');
const UsersService = require('../users/users-service');
const postsRouter = express.Router();
const jsonParser = express.json();
const verifyJWTToken = require("../auth/auth");
const serializedPost = post =>({
    id:post.id,
    user_id:post.user_id,
    title:xss(post.title),
    link:xss(post.link),
    start_date:post.start_date,
    by:xss(post.by),
    content:xss(post.content),
    post_type:post.post_type,
    date_created:post.date_created
})

postsRouter
  .route('/:username')
  .get(validateBearerToken, (req, res, next)=>{  
  UsersService.getUserByUsername(
    req.app.get('db'),
    req.params.username
  )
  .then(user=>{

    if(!user){
       return res.status(404).json({
       error: {message: `User doesn't exist` }
        });
      }
    
      PostsService.getPostsByUserId(
          req.app.get('db'),
          user.id
      )
      .then(posts=>{
          if(posts.length===0){
            return res.status(404).json({
            error: {message: `Posts with that username or id do not exsit`}
            });
          }
          res.json(posts.map(serializedPost)); 
        })
      .catch(next)
      
  })
  .catch(next)    
 
    })
    .post(jsonParser, (req, res, next)=>{
       const { title, link, by,content, post_type } = req.body;
       const validPostTypes = [`recipe`, `lifestyle`,`event`,`book`,`podcast`];

       UsersService.getUserByUsername(
        req.app.get('db'),
        req.params.username
      )
      .then(user=>{    
        if(!user){
           return res.status(404).json({
           error: {message: `User doesn't exist` }
            });
          }
          const user_id = user.id;
          const newPost = { user_id, title, link,by,content, post_type };
          PostsService.insertNewPost(
            req.app.get('db'),
              newPost
          )
          .then(post=>{
             res
          .status(201)
             .location(path.posix.join(req.originalUrl + `/${post.id}`))
             .json(serializedPost(post))
            })  
          

    /*if(!user_id){
         return res.status(400).json({
         error: { message : `Missing user_id in request body` }
       })
    }
    if(!post_type){
       return res.status(400).json({
       error: { message : `Missing post_type in request body` }
    })
    }
    if(validPostTypes.indexOf(post_type)===-1){
      return res.status(400).json({
      error: { message : `Post type must be either recipe, lifestyle, event ,book, or podcast` }
    })
    }
    if(post_type==='event'&&(!title || !content || !link)){
      return res.status(400).json({
      error: { message : `Event post type must be include a title, content and link` }
      })
    }
    if(post_type==='lifestyle'&&(!title || !by || !link)){
       return res.status(400).json({
       error: { message : `Lifestyle post type must be include a title, by and link` }
       })
    }
    if(post_type==='podcast'&&(!title || !content || !link)){
      return res.status(400).json({
      error: { message : `Podcast post type must be include a title, content and link` }
      })
    }
    if(post_type==='book'&&(!title || !by )){
      return res.status(400).json({
      error: { message : `Book post type must be include a title and by` }
      })
    }
    if(post_type==='recipe' &&(!title || !content)){
      return res.status(400).json({
      error: { message : `Recipe post type must be include a title and content` }
    })
    }*/
    
    })

  })
postsRouter
    .route(`/:post_id`)
    .all((req, res, next)=>{
        PostsService.getPostByPostId(
          req.app.get('db'),
          req.params.post_id
        )
    .then(post=>{
       if(!post){
         return res.status(404).json({
         error: {message: `Post doesn't exist` }
         });
       }
       res.post = post;
       next()
      })
    .catch(next)       
    })
    .get((req, res, next)=>{
        res.json(serializedPost(res.post));
    })
    .delete((req, res, next)=>{
       PostsService.deletePost(
         req.app.get('db'),
         req.params.post_id
       )
       .then(()=>{
          res.status(204).end()
        })
        .catch(next)
    })


  function validateBearerToken(req, res, next) {
      const authToken = req.get('Authorization')
      if(!authToken) return res.status(401).json({ error: 'Unauthorized request' });
      //console.log(authToken.split(' ')[1]);
      console.log(authToken);
      if(!verifyJWTToken(authToken) )
      {
        return res.status(401).json({ error: 'Unauthorized request' });
      }
      // move to the next middleware
      next()
  }

module.exports = postsRouter; 