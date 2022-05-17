import { users, posts, comments } from "./db";

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
  },

  Mutation: {
    createUser: (parent, { id, name, email, age, uniquenickname }, context, info) => {
      const newUser = { id, name, email, age, uniquenickname };

      users.map((user)=>{
        if (newUser.uniquenickname == user.uniquenickname)
        {
          
          throw new Error("Sorry, a user with that unique url already exists.");
        }
      })

      users.push(newUser);

      return newUser;
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      let newUser = users.find(user => user.id === id);

      newUser.name = name;
      newUser.email = email;
      newUser.age = age;

      return newUser;
    },
    deleteUser: (parent, { id }, context, info) => {
      
      const userIndex = users.findIndex(user => user.id == id);
      //console.log(userIndex);

      if (userIndex === -1) throw new Error("User not found.");

      const deletedUsers = users.splice(userIndex, 1);

      return deletedUsers[0];
    },

    createPost: (parent, { id, userid, title, content, slug }, context, info) => {
      var lastupdate = new Date(Date.now()).toDateString();
      //console.log(updateTime);

      //console.log('ran with' + content);

      const newPost = { id, userid, title, content, slug, lastupdate };

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
    updatePost: (parent, { id, title, content, slug }, context, info) => {

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

      return newPost;
    },
    deletePost: (parent, { id }, context, info) => {
      
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



  }

};

export default resolvers;
