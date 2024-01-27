import DefaultLayout from '../layout/defaultLayout/DefaultLayout';
import HomePage from '../pages/homePage/HomePage';
import Login from '../pages/login/Login';
import CreatePost from '../pages/createPost/CreatePost';
import SignUp from '../pages/signup/SignUp';
import CreateStop from '../pages/createStop/CreateStop';
import PostDetail from '../pages/postDetail/PostDetail';
import DetailSearch from '../pages/detailSearch/DetailSearch';
import Result from '../pages/detailSearchResult/Result';
import FindNearStop from '../pages/findNearStop/findNearStop';
import SavedPost from '../pages/savedPost/SavedPost';
import UserPosts from '../pages/userPosts/UserPosts';
import UpdatePost from '../pages/updatePost/UpdatePost';
import FindByMap from '../pages/findbyMap/FindByMap';

export const publicRoutes = [
    {path: '/', element : HomePage, layout: DefaultLayout},
    {path: '/login', element : Login, layout: DefaultLayout},
    {path: '/signup', element : SignUp, layout: DefaultLayout},
    {path: '/user/createstop', element : CreateStop, layout: DefaultLayout},
    {path: '/post/:id', element : PostDetail, layout: DefaultLayout},
    {path: '/detail-search', element : DetailSearch, layout: DefaultLayout},
    {path: '/detail-search/result', element : Result, layout: DefaultLayout},
    {path: '/find-near-stop', element : FindNearStop, layout: DefaultLayout},
    {path: '/find-by-map', element : FindByMap, layout: DefaultLayout},
];

export const privateRoutes = [
    {path: '/user/create', element : CreatePost, layout: DefaultLayout},
    {path: '/user/saved-post', element : SavedPost, layout: DefaultLayout},
    {path: '/user/posts', element : UserPosts, layout: DefaultLayout},
    {path: '/user/post/:id/update', element : UpdatePost, layout: DefaultLayout},
];
