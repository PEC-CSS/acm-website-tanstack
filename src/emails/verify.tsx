import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  name: string;
  token: string;
}

const BASE_URL =
  process.env.NODE_ENV === "production" ? "https://pecacm.com" : "http://localhost:3000";

function VerifyEmail({ name, token }: VerifyEmailProps) {
  const VERIFY_URL = `${BASE_URL}/api/auth/verify-email/${token}`;

  return (
    <Html>
      <Head />
      <Body
        style={{
          padding: "2rem",
          fontFamily: "sans-serif",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: "568px",
          }}
        >
          <Heading as="h1">
            <Link
              href={BASE_URL}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Img
                alt="logo for PEC ACM"
                src={`${BASE_URL}/assets/pec-acm-logo.png`}
                style={{
                  height: "3rem",
                  width: "3rem",
                }}
                height="1080"
                width="1080"
              />{" "}
              <Text
                style={{
                  color: "black",
                  paddingLeft: "1rem",
                  fontSize: "2rem",
                  fontWeight: "500",
                }}
              >
                PEC ACM
              </Text>
            </Link>
          </Heading>
          <Heading
            as="h2"
            style={{ fontWeight: "500" }}
          >
            Hello {name}!
          </Heading>
          <Text>
            You are receiving this email because you registered for PEC ACM. Please click the button
            below to verify your email address and complete your registration.
          </Text>
          <Button
            href={VERIFY_URL}
            style={{
              background: "#0075ff",
              padding: "1rem",
              borderRadius: "4px",
              color: "white",
            }}
          >
            Verify Email Address
          </Button>
          <Text>If you did not create an account with PEC ACM, no further action is required.</Text>
          <Text
            style={{
              paddingBottom: "0rem",
            }}
          >
            Regards,
            <br />
            PEC ACM
          </Text>

          <Hr />

          <Text style={{ whiteSpace: "wrap" }}>
            If you're having trouble clicking the "Verify Email Address" button, copy and paste the
            URL below into your web browser:&nbsp;
            <Link
              href={VERIFY_URL}
              style={{ whiteSpace: "collapse", textDecoration: "underline" }}
            >
              {VERIFY_URL}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

VerifyEmail.PreviewProps = {
  name: "Eikichi Onizuka",
  token: "b29eb4f0-9301-4390-bfec-9ab2fc4e91a6",
} as VerifyEmailProps;

// oxlint-disable-next-line import/no-default-export -- React Email requires default export for preview system and template discoverablility.
export default VerifyEmail;
