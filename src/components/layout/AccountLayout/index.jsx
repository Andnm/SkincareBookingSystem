import React from "react";
import AccountSidebar from "../../slider/AccountSidebar";

const AccountLayout = ({ children }) => {
    return (
        <div className="light-gray-background py-12">
            <div className="container account-page">
                <div className="flex h-fit ">
                    <AccountSidebar />
                    <div className="flex-1 px-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AccountLayout;