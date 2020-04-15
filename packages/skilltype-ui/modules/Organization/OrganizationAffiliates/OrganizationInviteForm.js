import React, { Component } from 'react'
import injectSheet from 'react-jss'
import { withNotifyContext } from '@skilltype/ui/components/Notify/NotifyProvider'
import Form from '@skilltype/ui/components/Form/Form'
import FormSection from '@skilltype/ui/components/Section/FormSection'
import EmailField from '@skilltype/ui/components/Form/Fields/EmailField'
import SubmitButton from '@skilltype/ui/components/Button/SubmitButton'
import SectionHeading from '@skilltype/ui/components/Heading/SectionHeading'
import { validateEmail } from '@skilltype/data/utils'
import HorizontalMenuContainer from '@skilltype/ui/components/Menu/HorizontalMenuContainer'
import FileInput from '@skilltype/ui/components/TextInput/FileInput'

import { withUserContext } from '../../../../skilltype-user/components/User/UserProvider'
import styles from '../styles'

class OrganizationInviteForm extends Component {
  state = {
    values: {},
    file: null,
  }

  handleChange = ({ values }) => {
    this.setState({ values })
  }

  handleFileChange = e => {
    const file = e.target.files[0]
    this.setState({ file })
  }

  handleSubmit = (e, { isValid }) => {
    if (!isValid) return
    const { values } = this.state
    const { organizationId, reloadInvites } = this.props

    const areAllEmailsValid = values.emails.split(',').every(validateEmail)

    if (areAllEmailsValid) {
      this.props.userContext
        .inviteUsers({
          organizationId,
          ...values,
        })
        .then(() => {
          reloadInvites()
        })
        .catch(() => {
          this.props.notifyError('Failed to reload invites')
          this.props.notifyClose(3000)
        })
      this.setState({ values: {} })
    } else {
      this.props.notifyError('Invalid Email: Make sure there are no typos')
      this.props.notifyClose(3000)
    }
  }

  render() {
    const { values } = this.state
    const { classes } = this.props

    return (
      <React.Fragment>
        <SectionHeading className={classes.title}>Invite</SectionHeading>
        <Form
          id="invite-users-form"
          values={values}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          disableSubmitUntilValid={false}
          style={{ paddingBottom: 0 }}
        >
          <FormSection style={{ border: 'none', paddingBottom: 0 }}>
            <EmailField
              id="emails"
              label="Email(s)"
              placeholder=""
              helperText="Send one or more invites. Please separate multiple addresses with commas"
              className={classes.helperText}
              required
            />
          </FormSection>
          <HorizontalMenuContainer
            style={{
              maxWidth: 'none',
              alignItems: 'center',
              boxShadow: 'none',
            }}
          >
            <p style={{ padding: '0 20px' }}>Bulk Upload</p>
            <FileInput
              id="users-csv"
              file={this.state.file}
              onChange={this.handleFileChange}
              acceptedFiles=".csv"
            />
            <SubmitButton style={{ margin: '0 15px 0 auto', width: '110px' }}>
              Send
            </SubmitButton>
          </HorizontalMenuContainer>
        </Form>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(
  withNotifyContext(withUserContext(OrganizationInviteForm))
)