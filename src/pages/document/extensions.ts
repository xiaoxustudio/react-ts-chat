import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Link } from 'react-router-dom';

export default [
    StarterKit.configure({
        history: false,
    }),
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === 'paragraph') {
                return '请输入内容';
            }

            return '';
        },
    }),
    Image,
    Link,
    Color.configure({
        types: ['textStyle'],
    }),
    CharacterCount.configure({ limit: 10000 }),
];
