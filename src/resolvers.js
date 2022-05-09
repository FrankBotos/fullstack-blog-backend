import { users, posts } from "./db";

const resolvers = {

  Query: {
    user: (parent, { id }, context, info) => {
      return users.find(user => user.id == id);
    },
    users: (parent, args, context, info) => {
      return users;
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
    }
  },

  Mutation: {
    createUser: (parent, { id, name, email, age }, context, info) => {
      const newUser = { id, name, email, age };

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
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex === -1) throw new Error("User not found.");

      const deletedUsers = users.splice(userIndex, 1);

      return deletedUsers[0];
    },

    createPost: (parent, { id, title, content, slug }, context, info) => {
      const newPost = { id, title, content, slug };
      posts.push(newPost);
      return newPost;
    },
    updatePost: (parent, { id, title, content, slug }, context, info) => {
      let newPost = posts.find(post => post.id === id);

      newPost.title = title;
      newPost.content = content;
      newPost.slug = slug;

      return newPost;
    },
    deletePost: (parent, { id }, context, info) => {
      const postIndex = posts.findIndex(post => post.id === id);

      if (postIndex === -1) throw new Error("Post not found.");

      const deletedPosts = posts.splice(postIndex, 1);

      return deletedPosts[0];
    }


  }

};

export default resolvers;
