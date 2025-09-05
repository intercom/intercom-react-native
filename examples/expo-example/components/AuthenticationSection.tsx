import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Section from './ui/Section';

interface AuthenticationSectionProps {
  loggedUser: boolean;
  email: string;
  setEmail: (email: string) => void;
  loginUnidentifiedUser: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export default function AuthenticationSection({
  loggedUser,
  email,
  setEmail,
  loginUnidentifiedUser,
  loginWithEmail,
  logout,
  isLoading,
}: AuthenticationSectionProps) {
  return (
    <Section title="🔐 Authentication">
      <Button
        title="Login as Unidentified User"
        onPress={loginUnidentifiedUser}
        disabled={loggedUser || isLoading}
      />

      <Input
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="user@example.com"
        keyboardType="email-address"
      />

      <Button
        title="Login with Email"
        onPress={() => loginWithEmail(email)}
        disabled={loggedUser || !email || isLoading}
      />

      <Button
        title="Logout"
        onPress={logout}
        disabled={!loggedUser || isLoading}
        variant="secondary"
      />
    </Section>
  );
}
