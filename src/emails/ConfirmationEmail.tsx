import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmationEmailProps {
  email: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const ConfirmationEmail = ({ email }: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Welcome to myjobb AI - Your AI-powered job search companion
      </Preview>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/myjobb-logo.png`}
          width="170"
          height="50"
          alt="myjobb AI"
          style={logo}
        />
        <Text style={paragraph}>Hi {email},</Text>
        <Text style={paragraph}>
          Welcome to myjobb AI! 🎉 Your email has been successfully verified and 
          you now have access to our AI-powered job search platform.
        </Text>
        <Text style={paragraph}>
          Get ready to discover:
        </Text>
        <Text style={featureList}>
          • AI-powered job matching and recommendations<br />
          • Smart resume optimization and analysis<br />
          • Interview preparation and practice tools<br />
          • Career insights and market trends
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="https://myjobb.ai/dashboard">
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Need help? Check out our getting started guide or contact our support team.
        </Text>
        <Text style={paragraph}>
          Best regards,
          <br />
          The myjobb AI team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 myjobb AI. All rights reserved.
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

const logo = {
  margin: '0 auto',
  display: 'block',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333',
};

const featureList = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333',
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
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