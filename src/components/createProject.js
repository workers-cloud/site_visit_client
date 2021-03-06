import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { ProjectQuery } from  '../stores/ProjectQuery';

import {Button, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

const ProjectCreateMutation = gql`
  mutation ProjectCreationMutation($projectInput: ProjectInputType!) {
    createProject(project: $projectInput) {
      id
      name
    }
  }`;

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props
      .mutate({
        variables: {
          projectInput: {
            name: `${this.state.value}`,
          },
        },
        refetchQueries: [{ query: ProjectQuery }],
      })
      .then(({data}) => {
        console.log('got data', data);
      })
      .catch(error => {
        console.log('there was an error sending the query', error);
      });
      event.target.elements['projectCreateInput'].value = ''
      this.state.value = ''
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="formBasicText">
          <ControlLabel>Project Name</ControlLabel>
          <FormControl
            name="projectCreateInput"
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button bsStyle="primary" type="submit">
          Create New Project
        </Button>
      </form>
    );
  }
}

CreateProject = graphql(ProjectCreateMutation)(CreateProject);
export default CreateProject;
