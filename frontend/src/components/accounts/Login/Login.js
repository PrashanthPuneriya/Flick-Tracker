import React from 'react';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    state = {
        shouldRedirect: false,
        message: null,
    }

    submitHandler = (event) => {
        event.preventDefault();
        let formData = new FormData(event.target);
        let object = {};
        formData.forEach((value, key) => { object[key] = value });
        fetch(`http://localhost:5000/api/login/`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object),
        })
            .then((response) => {
                if (response.status === 200) {
                    // if this is called then further down this logic shouldn't update the state.
                    // Hence, to avoid updating state we use componentWillUnmount() as a workaround.
                    this.setState({ shouldRedirect: !this.state.shouldRedirect })
                }
                console.log(response)
                console.log(response.headers);
                return (response.json());
            })
            .then((data) => {
                console.log(data)
                this.setState({ message: data['message'] })
            })
            .catch((error) => {
                console.error(error);
            })
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const shouldRedirect = this.state.shouldRedirect
        let message = this.state.message;
        if (shouldRedirect) {
            return <Redirect to="/profile" />
        }
        else return (
            <div>
                {
                    message !== null ?
                        <h3>{message}</h3>
                        :
                        null
                }
                <h1>Login Page</h1>
                <form className="LoginForm" onSubmit={this.submitHandler}>
                    <label>
                        Email:
                        <input type="email" name="email" placeholder="Email" required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" placeholder="Password" required />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default Login;