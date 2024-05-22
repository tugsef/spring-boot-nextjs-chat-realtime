import UserMessageList from "@/components/Home/UserMessageList";
import React from "react";

function page({ params }: { params: {user:string} }) {
  return (
    <div>
      <UserMessageList id={params.user} />
    </div>
  );
}

export default page;
