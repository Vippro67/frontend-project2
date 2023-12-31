import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { fetchFriendsSearch } from '../../api';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchFriendsPage = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [view, setView] = useState('searchFriends');

  const [searchResult, setSearchResult] = useState<any | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt();
      setCurrentUser(response);
    }

    fetchCurrentUser();
  }, []);
  const handleSearch = async () => {
    const search = document.getElementById('search') as HTMLInputElement;
    const response: any = await fetchFriendsSearch(search?.value || '');
    setSearchResult(response.data);
  };

  const handleAddFriend = async (id: number) => {
    await axios
      .get(`http://localhost:3001/api/v1/relationships/add-friend/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          alert('Send friend request successfully');
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((user: any) => {
        if (user.id == currentUser?.id) {
          return;
        }
        return (
          <div className="flex justify-between border rounded m-2 p-2 max ">
            <div className="flex items-center">
              <Link to={`/profile/${user.id}`}>
                <img
                  className="w-20 h-20 rounded-full"
                  src={user.avatar}
                  alt=""
                />
              </Link>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                onClick={() => handleAddFriend(user.id)}
              >
                Add Friend
              </button>
            </div>
          </div>
        );
      });
    }
  };

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-10  xl:p-2 xl:rounded-xl  bg-white xl:m-2 ">
        <div className=" gird">
          <Link to="/friends">
            <button
              className={
                view == 'listFriends'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('listFriends')}
            >
              List Friends
            </button>
          </Link>
          <Link to="/friends/search">
            <button
              className={
                view == 'searchFriends'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('searchFriends')}
            >
              Search Friends
            </button>
          </Link>
          <Link to="/friends/friends-request">
            <button
              className={
                view == 'friendsRequest'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('friendsRequest')}
            >
              Friends Request
            </button>
          </Link>

          <Link to="/friends/friends-sent">
            {' '}
            <button
              className={
                view == 'friendsSent'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('friendsSent')}
            >
              Friends Sent
            </button>
          </Link>
        </div>
        <div className="items-left">
          <div>
            <div className="grid grid-cols-7">
              <div className="grid col-span-7 grid-cols-3 ">
                <div className="ml-2 col-span-7">
                  <div>
                    <div>
                      <div className="">
                        <p className="text-lg mx-2 font-bold">Find Friend</p>
                      </div>
                      <div className="flex justify-between">
                        <label className="m-2 w-[80%] h-12 ">
                          <input
                            id="search"
                            type="search"
                            className="h-9 px-2 text-lg w-full border-2 border-slate-950"
                            placeholder="Search by friend name"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSearch();
                              }
                            }}
                          ></input>
                        </label>
                        <button onClick={handleSearch}>
                          <img
                            src="https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/search.svg"
                            height={32}
                            width={32}
                            alt="search"
                            className="mx-2"
                          />
                        </button>
                      </div>
                      {showListSearch()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFriendsPage;
