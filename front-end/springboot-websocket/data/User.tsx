export interface User {
  id: number;
  firstname: string;
  lastname: string;
  nickName: string;
  status: "ONLINE" | "OFFLINE" | string;
}

export const userList: User[] = [
{
    id:1,
    firstname:"user-1",
    lastname:"user-1",
    nickName:"user-1",
    status:"ONLINE"
},
{
    id:2,
    firstname:"user-2",
    lastname:"user-2",
    nickName:"user-2",
    status:"ONLINE"
},
{
    id:3,
    firstname:"user-3",
    lastname:"user-3",
    nickName:"user-3",
    status:"ONLINE"
},
{
    id:4,
    firstname:"user-4",
    lastname:"user-4",
    nickName:"user-4",
    status:"ONLINE"
}
]