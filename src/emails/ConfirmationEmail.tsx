import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmationEmailProps {
  email: string;
}

export const ConfirmationEmail = ({ email }: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Welcome to myjobb AI - Your AI-powered job search companion
      </Preview>
      <Container style={container}>
       
        <Text style={paragraph}>Hi {email},</Text>
        <Text style={paragraph}>
          Welcome! 🎉 Your email has been successfully verified and 
          you now have access to platform.
        </Text>
        
        <Section style={btnContainer}>
          <Button style={button} href="https://myjobb-assignment-navy.vercel.app/dashboard">
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Best regards,
          <br />
          The Ass team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 Ass. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

ConfirmationEmail.PreviewProps = {
  email: 'user@example.com',
} as ConfirmationEmailProps;

export default ConfirmationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};


const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333',
};
const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
};