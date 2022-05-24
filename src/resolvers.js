import { users, posts, comments, bookmarks, favoriteUsers } from "./db";


const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
var hashToCompare = null;
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  //console.log(hash)
  //hashToCompare = hash;
});
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hashToCompare, function(err, result) {
  // result == true
  //console.log('match')
});
bcrypt.compare(someOtherPlaintextPassword, hashToCompare, function(err, result) {
  // result == false
  //console.log('not match')
});


//manually hash passwords for hardcoded users, so we have initial data to work with
//for new users, this process takes place in "createuser"
users.map((user)=>{
  if(user.password == "placeholder"){
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      user.password = hash;
    });
  }
})





const resolvers = {

  Query: {
    user: (parent, { id }, context, info) => {
      return users.find(user => user.id == id);
    },
    users: (parent, args, context, info) => {
      return users;
    },
    userslug: (parent, { slug }, context, info) => {
      return users.find(user => user.uniquenickname == slug);
    },

    post: (parent, { id }, context, info) => {
      return posts.find(post => post.id == id);
    },
    postslug: (parent, { slug }, context, info) => {
      return posts.find(post => post.slug == slug);
    },
    postuserid: (parent, { userid }, context, info) => {
      //console.log(posts.filter(post => post.userid == userid))

      

      return posts.filter(post => post.userid == userid);
    },
    posts: (parent, args, context, info) => {
      return posts;
    },
    comments: (parent, args, context, info) => {
      return comments;
    },
    commentsbypostid: (parent, { postid }, context, info) => {
      return comments.filter(comment => comment.postid == postid);
    },

    bookmarks: (parent, { userid }, context, info) => {
      return bookmarks.filter(bookmark => bookmark.userid == userid);
    },
    favoriteusers: (parent, { userid }, context, info) => {
      return favoriteUsers.filter(favUser => favUser.userid == userid);
    },
    userLogin: async (parent, { username, password }, context, info) => {

      var index = users.findIndex(user => user.uniquenickname == username);


      if(index != -1) {
        const res = await bcrypt.compare(password, users.at(index).password);
        if (res != true) {
          throw new Error("Inccorect pass!")
        }
      } else {
        throw new Error("That user does not exist!");
      }

      //if we passed all checks, user is logged in, and we return user info
      return users.at(index);
      

    },
  },

  Mutation: {
    createUser: (parent, { id, name, email, age, uniquenickname, password }, context, info) => {

      const newUser = { id, name, email, age, uniquenickname, password };

      users.map((user)=>{
        if (newUser.uniquenickname == user.uniquenickname)
        {
          
          throw new Error("Sorry, a user with that unique url already exists.");
        }
      })

      users.push(newUser);

      //find new user by id, and hash the password
      users.forEach((user)=>{
        if(user.id==id){
          bcrypt.hash(user.password, saltRounds, function(err, hash) {
            user.password = hash;
          });
        }
      })



      return newUser;
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      let newUser = users.find(user => user.id === id);

      newUser.name = name;
      newUser.email = email;
      newUser.age = age;

      return newUser;
    },
    updateProfileImage: (parent, { userid, imgurl }, context, info) => {
      let newUser = users.find(user => user.id == userid);

      newUser.profileimage = imgurl;

      return newUser;
    },
    deleteUser: (parent, { id }, context, info) => {
      
      const userIndex = users.findIndex(user => user.id == id);
      //console.log(userIndex);

      if (userIndex === -1) throw new Error("User not found.");

      async function deleteAssociatedData(){
        //if a user is deleted, delete their bookmarks, their posts, their comments, and their favorited users



        //1.delete all associated bookmarks (bookmarks belonging to deleted user, and bookmarks belonging to other users, who bookmarked deleted user's posts)
        const userPosts = posts.filter((post) =>{
          return post.userid == id;
        })

        var bookmarksAfterDelete = bookmarks.filter((bm)=>{//first we remove all bookmarks saved by the user about to be deleted
          return bm.userid != id
        })

        //next we iterate through deleted user's posts, and delete all bookmarks related to that post
        userPosts.forEach((post)=>{
          bookmarksAfterDelete = bookmarksAfterDelete.filter((bookmark)=>{
            return bookmark.postid != post.id
          })
        })
        //lastly we update the original bookmark list with our filtered values
        bookmarks.splice(0, bookmarks.length, ...bookmarksAfterDelete);



        //2.delete associated favorites (favorites belonging to the deleted user, and favorites beloning to other users, who favorited to be deleted user)
        var favsAfterDelete = favoriteUsers.filter((fav)=>{//delete favorite users beloning to user about to be deleted
          return fav.userid != id;
        })
        favsAfterDelete = favsAfterDelete.filter((fav)=>{//delete user from other users' favorite lists
          return fav.favoriteuserid != id;
        })
        //update favorites list with new values
        favoriteUsers.splice(0, favoriteUsers.length, ...favsAfterDelete);



        //3.delete all comments made by user, and all comments made by other users on their posts
        var commentsAfterDelete=comments.filter((comment)=>{
          return comment.userid != id;
        })
        userPosts.forEach((post)=>{
          commentsAfterDelete = commentsAfterDelete.filter((comment)=>{
            return comment.postid != post.id;
          })
        })
        //update with new values
        comments.splice(0, comments.length, ...commentsAfterDelete);

        //4.finally, we delete the user's posts
        var postsAfterDelete = posts.filter((post)=>{
          return post.userid != id;
        })
        posts.splice(0, posts.length, ...postsAfterDelete);
        //console.log(posts);
        

      }
      deleteAssociatedData();

      const deletedUsers = users.splice(userIndex, 1);

      return deletedUsers[0];
    },

    createPost: (parent, { id, userid, title, content, slug, coverimage }, context, info) => {
      var lastupdate = new Date(Date.now()).toDateString();
      //console.log(updateTime);

      //console.log('ran with' + content);

      var views = 0;
      const newPost = { id, userid, title, content, slug, lastupdate, views, coverimage };

      const userPosts = posts.filter((blogpost)=>{
        return blogpost.userid == userid;
      });
      userPosts.map((blogpost)=>{
        if (blogpost.slug ==slug){
          throw new Error("Please use a unique post title.");
        }
      })


      posts.push(newPost);
      return newPost;
    },
    updatePost: (parent, { id, title, content, slug, coverimage }, context, info) => {

      var lastupdate = new Date(Date.now()).toDateString();

      //console.log('ran update with' + id + ' ' + content + ' ' + slug);
      let newPost = posts.find(post => post.id == id);

      

      const userPosts = posts.filter((blogpost)=>{
        return blogpost.userid == newPost.userid;
      });

      const userPostsMinusCurrent = userPosts.filter((blogpost)=>{
        return blogpost.slug != newPost.slug;
      });
      
      userPostsMinusCurrent.map((blogpost)=>{
        if (blogpost.slug ==slug){
          throw new Error("A previous post has that title! Please use a unique post title.");
        }
      })

      newPost.title = title;
      newPost.content = content;
      newPost.slug = slug;
      newPost.lastupdate = lastupdate;
      newPost.coverimage = coverimage;

      return newPost;
    },
    deletePost: (parent, { id }, context, info) => {

      //when a post is deleted, we must also delete all bookmarks referencing that post, and all comments for that post
      var bookmarksAfterDelete = bookmarks.filter((bookmark)=>{
        return bookmark.postid != id;
      })
      bookmarks.splice(0, bookmarks.length, ...bookmarksAfterDelete);
      var commentsAfterDelete = comments.filter((comment)=>{
        return comment.postid != id;
      })
      comments.splice(0, comments.length, ...commentsAfterDelete);


      
      const postIndex = posts.findIndex(post => post.id == id);

      if (postIndex === -1) throw new Error("Post not found.");

      const deletedPosts = posts.splice(postIndex, 1);

      return deletedPosts[0];
    },
    createComment: (parent, { id, userid, postid, content }, context, info) => {
      var lastupdate = new Date(Date.now()).toDateString();
      //console.log(updateTime);

      //console.log('ran with' + content);

      const newComment = { id, userid, postid, content, lastupdate };
      comments.push(newComment);

      return newComment;
    },
    deleteComment: (parent, { id }, context, info) => {
      
      const commentIndex = comments.findIndex(comment => comment.id == id);

      if (commentIndex === -1) throw new Error("Comment not found.");

      const deletedComments = comments.splice(commentIndex, 1);

      

      return deletedComments[0];
    },
    incrementViews: (parent, { postid }, context, info) => {

      const postRef = posts.find(post => post.id == postid);
      postRef.views++;
      return postRef;
    },
    createBookmark: (parent, { id, userid, postid }, context, info) => {

      const newBookmark = { id, userid, postid };
      bookmarks.push(newBookmark);

      return newBookmark;
    },
    deleteBookmark: (parent, { id }, context, info) => {
      
      const bmIndex = bookmarks.findIndex(bm => bm.id == id);
      //console.log(bmIndex);

      if (bmIndex === -1) throw new Error("Bookmark not found.");

      const bookmarksAfterDelete = bookmarks.splice(bmIndex, 1);

      return bookmarksAfterDelete[0];
    },
    deleteFavoriteUser: (parent, { id }, context, info) => {
      
      const favIndex = favoriteUsers.findIndex(fav => fav.id == id);
      //console.log(bmIndex);

      if (favIndex === -1) throw new Error("Favorite user not found.");

      const favoriteUsersAfterDelete = favoriteUsers.splice(favIndex, 1);

      return favoriteUsersAfterDelete[0];
    },
    createFavoriteUser: (parent, { id, userid, favoriteuserid }, context, info) => {

      const newFav = { id, userid, favoriteuserid };
      favoriteUsers.push(newFav);

      return newFav;
    },



  }

};

export default resolvers;
