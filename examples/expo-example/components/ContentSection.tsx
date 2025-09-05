import React, { useState } from 'react';
import { Alert } from 'react-native';
import Intercom, { IntercomContent } from '@intercom/intercom-react-native';
import Button from './ui/Button';
import Input from './ui/Input';
import Section from './ui/Section';

const ARTICLE_ID = '123456';
const SEARCH_TERM = 'help';

interface ContentSectionProps {
  loggedUser: boolean;
}

export default function ContentSection({ loggedUser }: ContentSectionProps) {
  const [articleId, setArticleId] = useState<string>(ARTICLE_ID);
  const [searchTerm, setSearchTerm] = useState<string>(SEARCH_TERM);

  const showResponseAlert = (obj: any) => {
    Alert.alert('RESPONSE', JSON.stringify(obj));
  };

  const showErrorAlert = (e: Error) => {
    Alert.alert('ERROR', JSON.stringify(e));
  };

  const handleShowArticle = () => {
    if (articleId) {
      const content = IntercomContent.articleWithArticleId(articleId);
      Intercom.presentContent(content);
    } else {
      Alert.alert('Error', 'Please enter an Article ID');
    }
  };

  const handleSearchHelpCenter = () => {
    if (searchTerm) {
      Intercom.searchHelpCenter(searchTerm)
        .then((items) => showResponseAlert(items))
        .catch(showErrorAlert);
    }
  };

  return (
    <Section title="📄 Content">
      <Input
        label="Article ID"
        value={articleId}
        onChangeText={setArticleId}
        placeholder="123456"
      />

      <Button
        title="Show Article"
        onPress={handleShowArticle}
        disabled={!loggedUser}
      />

      <Input
        label="Search Term"
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="help topic"
      />

      <Button
        title="Search Help Center"
        onPress={handleSearchHelpCenter}
        disabled={!loggedUser}
      />
    </Section>
  );
}
