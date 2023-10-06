import React from 'react';
import { FieldProps, FieldValidation } from '@rjsf/core';
import FormControl from '@material-ui/core/FormControl';
import { InputLabel, Input, FormHelperText, List, ListItem, Link } from '@material-ui/core';
/*
 This is the actual component that will get rendered in the form
*/
export const ValidateHumanitecAppID = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldProps<string>) => {
  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <InputLabel htmlFor="validateName">Name</InputLabel>
      <Input
        id="validateName"
        aria-describedby="entityName"
        onChange={e => onChange(e.target?.value)}
      />
      <FormHelperText id="entityName">
        <List>
          <ListItem>Must only contain alphanumeric characters, numbers, or dashes.</ListItem>
          <ListItem>Must be lowercase.</ListItem>
          <ListItem>Must be at least 3 characters long.</ListItem>
          <ListItem>Must be at most 50 characters long.</ListItem>
          <ListItem>Cannot start or end with a dash.</ListItem>
          <ListItem>
            See&nbsp;
            <Link target="_blank" rel="noopener" href="https://developer.humanitec.com/platform-orchestrator/reference/constraints/#application-names">
              https://developer.humanitec.com/platform-orchestrator/reference/constraints/#application-names
            </Link>
            &nbsp;for more details.
          </ListItem>
        </List>
      </FormHelperText>
    </FormControl>
  );
};

/*
 This is a validation function that will run when the form is submitted.
  You will get the value from the `onChange` handler before as the value here to make sure that the types are aligned\
*/

export const validateHumanitecAppIDValidation = (
  value: string,
  validation: FieldValidation,
) => {
  const validID = /^[a-z0-9](?:-?[a-z0-9]+)+$/g.test(value);

  if (validID === false) {
    validation.addError(`Invalid Application ID`);
  }

  if (value.length > 50) {
    validation.addError('Application IDs can only be up to 50 characters.');
  }
};
