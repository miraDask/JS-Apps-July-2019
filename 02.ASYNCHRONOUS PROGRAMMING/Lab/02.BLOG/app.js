function attachEvents() {
    const btnLoadPosts = document.getElementById('btnLoadPosts');
    const btnViewPost = document.getElementById('btnViewPost');
    const select = document.getElementById('posts');
    const commentsUL = document.getElementById('post-comments');

    const defaultUrl = 'https://blog-apps-c12bf.firebaseio.com/';
    const getRequestAddition = 'posts.json';
    const commentsAddition = 'comments.json';
    let postId = '';
    let fragment = document.createDocumentFragment();

    const loadPostsOptions = async () => {
        const response = await fetch(defaultUrl + getRequestAddition);
        const posts = await response.json();
        const postsKeys = Object.keys(posts);

        postsKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = posts[key].title;
            fragment.appendChild(option);
        });

        select.appendChild(fragment);
    };

    const loadPostBody = async (url) => {
        const response = await fetch(url);
        const postsData = await response.json();
        postId = postsData.id;
        document.getElementById('post-title').innerHTML = postsData.title;
        document.getElementById('post-body').innerHTML = postsData.body;

    };

    const loadComments = async () => {
        const response = await fetch(defaultUrl + commentsAddition);
        const commentsData = await response.json();
        commentsUL.innerHTML = '';

        for (const key in commentsData) {
            if (commentsData[key].postId === postId) {
                const li = document.createElement('li');
                li.textContent = commentsData[key].text;
                fragment.appendChild(li);
            }
        }

        commentsUL.appendChild(fragment);
    };

    const loadSelectedPostDetails = async () => {
        const postKey = select.value;
        const url = defaultUrl + `posts/${postKey}.json`;
        await loadPostBody(url);
        await loadComments();
    };

    btnLoadPosts.addEventListener('click', loadPostsOptions);
    btnViewPost.addEventListener('click', loadSelectedPostDetails);
}

attachEvents();