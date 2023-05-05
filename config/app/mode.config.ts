import { FiCode, FiFile, FiMessageCircle } from 'react-icons/fi';

interface ModeProps {
    title: string;
    value: string;
    icon: React.ElementType;
    link: string;
}

interface CodeModeProps {
    name: string;
    value: string;
    hint: string;
}

interface CodeLanguageProps {
    name: string;
    value: string;
}

export const ModeList: ModeProps[] = [
    {
        title: 'Chat',
        value: 'chat',
        icon: FiMessageCircle,
        link: '/mode/chat',
    },
    {
        title: 'Code',
        value: 'code',
        icon: FiCode,
        link: '/mode/code',
    },
    {
        title: 'File',
        value: 'file',
        icon: FiFile,
        link: '/mode/file',
    },
];

export const CodeModeConfig: CodeModeProps[] = [
    { name: 'Explain', value: 'explain', hint: 'This mode will explain what the code means.' },
    { name: 'Convert', value: 'convert', hint: 'This mode will convert the code to a different language.' },
    { name: 'Custom', value: 'custom', hint: 'This mode will allow you to create your own custom rule.' },
];

export const CodeLanguageList: CodeLanguageProps[] = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C++', value: 'cpp' },
    { name: 'C#', value: 'csharp' },
    { name: 'PHP', value: 'php' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'Go', value: 'go' },
    { name: 'Rust', value: 'rust' },
    { name: 'Swift', value: 'swift' },
    { name: 'Kotlin', value: 'kotlin' },
    { name: 'Dart', value: 'dart' },
    { name: 'C', value: 'c' },
    { name: 'Objective-C', value: 'objectivec' },
    { name: 'Scala', value: 'scala' },
    { name: 'Perl', value: 'perl' },
    { name: 'Haskell', value: 'haskell' },
    { name: 'Lua', value: 'lua' },
    { name: 'R', value: 'r' },
    { name: 'SQL', value: 'sql' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'JSON', value: 'json' },
    { name: 'XML', value: 'xml' },
];
