import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {
  ButtonGroup,
  FormGroup,
  ControlLabel,
  FormControl,
  Grid,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import Logout from '../components/LogOut';

const LoginMutation = gql`
  mutation SignIn($signInInput: signInInput!) {
    signIn(input: $signInInput) {
      email
      token
    }
  }
`;

const IsLoggedInQuery = gql`
  query localStateInfo {
    localStateInfo @client
  }
`;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // // reset login status
    // this.props.dispatch(userActions.logout());

    this.state = {
      email: '',
      password: '',
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const {name, value} = e.target;
    console.log(`change; ${name}: ${value}`);
    this.setState({[name]: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('logging in');

    this.setState({submitted: true});
    const {email, password} = this.state;
    this.props
      .mutate({
        variables: {
          signInInput: {
            email: `${email}`,
            password: `${password}`,
          },
        },
      })
      .then(({data}) => {
        console.log('login reply', data);
        localStorage.setItem('token', data.signIn.token);
      })
      .catch(error => {
        console.log('there was an error sending the query', error);
      });
  }

  render() {
    let {data} = this.props;
    console.log('login page - got data');
    console.log(JSON.stringify(data));
    return (
      <div className="Login">
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>Login</h2>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email">
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    autoFocus
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="password">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.password}
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                  />
                </FormGroup>
                <ButtonGroup vertical>
                  <Button
                    bsStyle="primary"
                    // disabled={!this.validateForm()}
                    type="submit"
                    onSubmit={this.handleSubmit}>
                    Login
                  </Button>
                  <Logout />
                </ButtonGroup>
              </form>
              <p />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

// LoginPage = graphql(IsLoggedInQuery)(LoginMutation)(LoginPage);
LoginPage = graphql(IsLoggedInQuery, LoginMutation)(LoginPage);
export default LoginPage;
