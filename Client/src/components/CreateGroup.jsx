import React, { useEffect, useState } from 'react'
import styles from './CreateGroup.module.css';
import {useAuth} from './../context/AuthContext';
import SearchUsersApi from './../api/SearchUsersApi';
import createGroupChat from '../api/createGroupChat';
function CreateGroup() {
    const {token} = useAuth();
    const [groupName,setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [searchedUsers,setSearchedUsers] = useState([]);
    const [selectedUser,setSelectedUsers] = useState([]);

    useEffect(()=>{
        getSearchData();
    },[search]);
   
    const onUserDeselect = (item) => {
        // console.log(item, selectedUser);
        setSelectedUsers((prevUsers) => {
            const updatedUsers = prevUsers.filter(user => user._id !== item._id);
            return updatedUsers;
        });
    };

    const onUserSelect = (item) => {
        // Check if the user is already selected using _id
        if (!selectedUser.some(user => user._id === item._id)) {
            setSelectedUsers((prevUsers) => {
                return [...prevUsers, item]; // Add user to selectedUser if not already present
            });
        }
    };
    
    const getSearchData = async() => {
        const data = await SearchUsersApi({ token, search });
        if (data.users && data.users.length > 0) {
            setSearchedUsers(data.users);
        }
        else{
            setSearchedUsers([])
        }
    };

    const onFieldChange = (e) => {
        const { name, value } = e.target;

        if (name === 'groupName') {
            setGroupName(value);
        } else if (name === 'search') {
            setSearch(value);
        }
    };

    const submitHander = (e) =>{
        e.preventDefault();
        // console.log([selectedUser.map((item,index)=>(item._id))])
        const {data} = createGroupChat({
            users:selectedUser.map((item,index)=>(item._id)),
            groupName,
            token
        })
        console.log(data);  
    };
  return (
    <div className={styles.container}>
        <form className={styles.form} onSubmit={submitHander}>
            <div className={styles.heading}>
                <p>Create Group Chat</p>
            </div>
            <div className={styles.textfields}>
                <input type='text' value={groupName} onChange={onFieldChange} name='groupName' placeholder='enter the group name'/>
                <input type='text' value={search} onChange={onFieldChange} name='search' placeholder='Members name'/>
            </div>
            <div className={styles.selectedMembers}>
            {
                selectedUser.map((item,index)=>{
                    return(
                        <div key={index} onClick={()=>onUserDeselect(item)} className={styles.selectedMember}>
                            <span>{item.name} x</span>
                        </div>
                    )

                })
            }
                
            </div>
            <div className={styles.searchedMembers}>
            {
                searchedUsers.map((item,index)=>{
                    return(
                        <div key={index} onClick={()=>onUserSelect(item)} className={styles.searchedMember}>
                            <span>{item.name}</span>
                            <p>{item.email}</p>
                        </div>
                    )
                })
            }
                
            </div>
            <button type='submit'>Create Chat</button>
        </form>
      </div>
  )
}

export default CreateGroup
