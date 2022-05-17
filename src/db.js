export let users = [
    { id: 1, name: "John Doe", email: "john@gmail.com", age: 22, uniquenickname: "john-doe" },
    { id: 2, name: "Jane Doe", email: "jane@gmail.com", age: 23, uniquenickname: "jane-doe" },
    { id: 3, name: "Person Three", email: "personthree@gmail.com", age: 25, uniquenickname: "person-three" }
  ];  

  export let posts  = [
    { id: 1, userid: 2, title: "Blog Post 1", content: "This is content for blog post 1", slug: "blog-post-1", lastupdate: "Wed May 11 2022" },
    { id: 2, userid: 2, title: "Blog Post 2", content: "This is content for blog post 2", slug: "blog-post-2", lastupdate: "Wed May 11 2022" },
    { id: 3, userid: 3, title: "Blog Post 3", content: "This is content for blog post 3", slug: "blog-post-3", lastupdate: "Wed May 11 2022" },
    { id: 4, userid: 3, title: "Test Post", content: "This is content for blog post 4", slug: "test-post", lastupdate: "Wed May 11 2022" },
    { id: 5, userid: 3, title: "ASDF Post", content: "This is content for blog post 5", slug: "asdf-post", lastupdate: "Wed May 11 2022" },
    { id: 6, userid: 2, title: "Another Entry", content: "This is content for blog post 6", slug: "another-entry", lastupdate: "Wed May 11 2022" },
  ];  

  export let comments  = [
    { id: 1, userid: 2, postid: 5, content: "This is content for comment 1", lastupdate: "Wed May 11 2022" },
    { id: 2, userid: 2, postid: 3, content: "This is content for comment 2", lastupdate: "Wed May 11 2022" },
    { id: 3, userid: 3, postid: 2, content: "This is content for comment 3", lastupdate: "Wed May 11 2022" },
    { id: 4, userid: 3, postid: 1, content: "This is content for comment 4", lastupdate: "Wed May 11 2022" },
    { id: 5, userid: 1, postid: 1, content: "This is content for comment 5", lastupdate: "Wed May 10 2022" },
    { id: 6, userid: 2, postid: 1, content: "This is content for comment 6", lastupdate: "Wed May 11 2022" },
    { id: 7, userid: 1, postid: 1, content: "This is content for comment 7", lastupdate: "Wed May 12 2022" },
  ]; 