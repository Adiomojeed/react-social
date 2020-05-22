/** @format */

import React from "react";
import { Link } from "@reach/router";
import { withFirebase } from "../Firebase/index";
import SignOut from "./SignOut";
import Avatar from "../../assets/images/male.png";

const isActive = ({ isCurrent }) => {
	return isCurrent ? { className: "active" } : {};
};

const NavLink = (props) => <Link getProps={isActive} {...props} />;

class SideBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: [],
			followers: "",
			following: "",
			avatar: Avatar,
		};
	}

	componentDidMount() {
		this.props.firebase.auth.onAuthStateChanged((authUser) => {
			this.props.firebase.db
				.ref(`users/${authUser.uid}`)
				.on("value", (snapshot) => {
					const userObject = snapshot.val();
					this.setState({ user: userObject });
				});
			this.props.firebase.db
				.ref(`followers/${authUser.uid}`)
				.on("value", (snapshot) => {
					const userObject = snapshot.val();
					this.setState({ followers: userObject });
				});
			this.props.firebase.db
				.ref(`following/${authUser.uid}`)
				.on("value", (snapshot) => {
					const userObject = snapshot.val();
					this.setState({ following: userObject });
				});
			this.props.firebase.storage
				.ref()
				.child(`images/${authUser.uid}`)
				.getDownloadURL()
				.then((url) => {
					this.setState({ avatar: url });
				});
		});
	}

	render() {
		const { user, followers, following, avatar } = this.state;
		return (
			<div className="siderow">
				<div className="close">
					<i className="fas fa-times text-light" id="close"></i>
				</div>
				<div className="avatar-block">
					<div>
						<img src={avatar} className="avatar" alt="" />
					</div>
					<h4 className="text-light">{user.FullName}</h4>
					<small className="name">@{user.UserName}</small>
					<small>
						<span>{followers.followers} Followers</span>
						<span>{following.following} Following</span>
					</small>
				</div>
				<ul className="nav-list">
					<li>
						<NavLink to="/dashboard">
							HOME
						</NavLink>
					</li>
					<li>
						<NavLink to="/dashboard/profile">PROFILE</NavLink>
					</li>
					<li>
						<NavLink to="/dashboard/search">SEARCH</NavLink>
					</li>
					<li>
						<NavLink to="/dashboard/followers">FOLLOWERS</NavLink>
					</li>
					<li>
						<NavLink to="/dashboard/settings">SETTINGS</NavLink>
					</li>
				</ul>
				<div className="signout-block">
					<SignOut />
				</div>
			</div>
		);
	}
}

export default withFirebase(SideBar);
