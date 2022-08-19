import React from "react";
import { IUsers } from "../../models/response/users.interface";
import { useGetUsersService } from "../../services/user/useGetUsers.service";
import GetUsers from "./user/GetUsers.component";
import Pagination from "../post/Pagination.component";
import Loader from "../ui/Loader.component";
import BasicInput from "../ui/BasicInput.component";
import { useGetUsersByNicknameService } from "../../services/user/useGetUsersByNickname.service";
import { useBanService } from "../../services/user/useBan.service";
import { IBan } from "../../models/request/ban.interface";
import { useUnbanService } from "../../services/user/useUnban.service";

const AdminUser = () => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<IUsers>({ count: 0, rows: [] });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { getUsers } = useGetUsersService()
  const { banUser } = useBanService()
  const { unbanUser } = useUnbanService()
  const { getUsersByNickname } = useGetUsersByNicknameService()

  const changeRowsPerPage = async (rows: number) => {
    await fetchUsers(rows * page, rows)
    setRowsPerPage(rows)
  }

  const changePage = async (page: number) => {
    await fetchUsers(rowsPerPage * page, rowsPerPage);
    setPage(page)
  }

  const blockUser = async (userBan: IBan) => {
    setLoading(true)
    await banUser(userBan, sessionStorage.getItem('_at'))
    await fetchUsers(0, 10)
    setLoading(false)
  }

  const unblockUser = async (email: string) => {
    setLoading(true)
    await unbanUser(email, sessionStorage.getItem('_at'))
    await fetchUsers(0, 10)
    setLoading(false)
  }

  const fetchUsers = async (offset: number, limit: number) => {
    setLoading(true)
    const listOfUsers = await getUsers(
      { offset, limit },
      sessionStorage.getItem('_at')
    )
    setUsers(listOfUsers)
    setLoading(false)
  }

  const fetchFilteredUsers = async () => {
    setLoading(true)
    const filteredUsers = await getUsersByNickname(searchQuery, sessionStorage.getItem('_at'))
    setUsers(filteredUsers)
    setLoading(false)
  }

  React.useEffect(() => {
    fetchUsers(0, 10).then()
  }, [])

  React.useEffect(() => {
    if (searchQuery.length) fetchFilteredUsers().then()
    else fetchUsers(0, 10).then()
  }, [searchQuery])

  return (
    <div className={'w-full'}>
      {loading ? <Loader/> : null}
      <BasicInput
        className={'m-auto mt-5 mb-5 rounded w-1/6'}
        type={'text'}
        placeholder={'Search...'}
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)}
      />
      <GetUsers
        count={users.count}
        rows={users.rows}
        banUser={blockUser}
        unbanUser={unblockUser}
      />
      <Pagination
        count={users.count}
        currentPage={page}
        setPage={changePage}
        rowsPerPageItems={[5, 10, 15]}
        rowsPerPage={rowsPerPage}
        rowsPerPageChange={changeRowsPerPage}
      />
    </div>
  );
};

export default AdminUser;
