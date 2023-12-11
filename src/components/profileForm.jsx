import React from "react";
import Form from "./common/form";
import { getUser } from "../services/userService";

class ProfileForm extends Form {
  state = { data: { name: "", email: "", isAdmin: false }, errors: {} };

  async populateUser() {
    try {
      const { data: user } = await getUser();
      this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  render() {
    return (
      <div>
        <h1>User Profile</h1>
        <form>
          {this.renderInput("name", "Username")}
          {this.renderInput("email", "Email")}
          {this.renderInput("isAdmin", "Admin")}
        </form>
      </div>
    );
  }
}

export default ProfileForm;
