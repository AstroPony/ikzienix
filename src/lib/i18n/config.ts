export const languages = {
  en: 'English',
  nl: 'Nederlands'
} as const

export type Language = keyof typeof languages

export const defaultLanguage: Language = 'nl'

export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      submit: 'Submit',
      required: 'Required',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
    },
    account: {
      title: 'My Account',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone Number',
      memberSince: 'Member Since',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
    },
    address: {
      line1: 'Address Line 1',
      line2: 'Address Line 2 (Optional)',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      sameAsShipping: 'Billing address same as shipping',
    },
    completeProfile: {
      title: 'Complete Your Profile',
      description: 'Please provide your shipping and billing information to complete your profile.',
      submit: 'Complete Profile',
      saving: 'Saving...',
    },
  },
  nl: {
    common: {
      loading: 'Laden...',
      save: 'Opslaan',
      cancel: 'Annuleren',
      edit: 'Bewerken',
      delete: 'Verwijderen',
      submit: 'Versturen',
      required: 'Verplicht',
    },
    auth: {
      signIn: 'Inloggen',
      signUp: 'Registreren',
      signOut: 'Uitloggen',
      email: 'E-mail',
      password: 'Wachtwoord',
      forgotPassword: 'Wachtwoord vergeten?',
    },
    account: {
      title: 'Mijn Account',
      personalInfo: 'Persoonlijke Informatie',
      name: 'Naam',
      email: 'E-mail',
      phone: 'Telefoonnummer',
      memberSince: 'Lid sinds',
      shippingAddress: 'Verzendadres',
      billingAddress: 'Factuuradres',
      editProfile: 'Profiel Bewerken',
      changePassword: 'Wachtwoord Wijzigen',
    },
    address: {
      line1: 'Adresregel 1',
      line2: 'Adresregel 2 (Optioneel)',
      city: 'Stad',
      postalCode: 'Postcode',
      country: 'Land',
      sameAsShipping: 'Factuuradres is hetzelfde als verzendadres',
    },
    completeProfile: {
      title: 'Voltooi Je Profiel',
      description: 'Vul je verzend- en factuuradres in om je profiel te voltooien.',
      submit: 'Profiel Voltooien',
      saving: 'Opslaan...',
    },
  },
} as const 