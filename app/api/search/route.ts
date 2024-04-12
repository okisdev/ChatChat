// import { GeneralModel } from '@/types/model';
// import { getGoogleSearch } from '@/utils/search/engines/google';
// import { AnthropicStream, StreamingTextResponse } from 'ai';
// import { defaultSearchPrompt, template1 } from '@/prompt/search';

// import Anthropic from '@anthropic-ai/sdk';

// import { CallbackManagerForRetrieverRun } from 'langchain/callbacks';
// import { ChatOpenAI } from '@langchain/openai';
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from '@langchain/core/prompts';
// import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
// import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api';
// import { DocumentCompressorPipeline } from 'langchain/retrievers/document_compressors';
// import { EmbeddingsFilter } from 'langchain/retrievers/document_compressors/embeddings_filter';
// import { Document } from 'langchain/document';
// import { BaseLanguageModel } from 'langchain/base_language';
// import { HumanMessage, AIMessage } from '@langchain/core/messages';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { RunnableMap, RunnableBranch, RunnableLambda, Runnable } from '@langchain/core/runnables';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { GoogleCustomSearch } from 'langchain/tools';

// const anthropic = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY || '',
// });

// export const runtime = 'edge';

// interface ChatRequest {
//     questions: string[];
//     chatHistory: string[];
// }

// const RESPONSE_TEMPLATE = `
// You are an expert researcher and writer, tasked with answering any question.

// Generate a comprehensive and informative, yet concise answer of 250 words or less for the \
// given question based solely on the provided search results (URL and content). You must \
// only use information from the provided search results. Use an unbiased and \
// journalistic tone. Combine search results together into a coherent answer. Do not \
// repeat text. Cite search results using [\${{number}}] notation. Only cite the most \
// relevant results that answer the question accurately. Place these citations at the end \
// of the sentence or paragraph that reference them - do not put them all at the end. If \
// different results refer to different entities within the same name, write separate \
// answers for each entity. If you want to cite multiple results for the same sentence, \
// format it as \`[\${{number1}}] [\${{number2}}]\`. However, you should NEVER do this with the \
// same number - if you want to cite \`number1\` multiple times for a sentence, only do \
// \`[\${{number1}}]\` not \`[\${{number1}}] [\${{number1}}]\`

// You should use bullet points in your answer for readability. Put citations where they apply \
// rather than putting them all at the end.

// If there is nothing in the context relevant to the question at hand, just say "Hmm, \
// I'm not sure." Don't try to make up an answer.

// Anything between the following \`context\` html blocks is retrieved from a knowledge \
// bank, not part of the conversation with the user.

// <context>
//     {context}
// <context/>

// REMEMBER: If there is no relevant information within the context, just say "Hmm, I'm \
// not sure." Don't try to make up an answer. Anything between the preceding 'context' \
// html blocks is retrieved from a knowledge bank, not part of the conversation with the \
// user. The current date is {current_date}.
// `;

// const REPHRASE_TEMPLATE = `
// Given the following conversation and a follow up question, rephrase the follow up \
// question to be a standalone question.

// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone Question:
// `;

// const getRetriever = () => {
//     const embeddings = new OpenAIEmbeddings({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 800,
//         chunkOverlap: 20,
//     });

//     const relevantFilter = new EmbeddingsFilter({
//         embeddings: embeddings,
//         similarityThreshold: 0.8,
//     });

//     const pipelineCompressor = new DocumentCompressorPipeline({
//         transformers: [splitter, relevantFilter],
//     });

//     const baseTavilyRetriever = new TavilySearchAPIRetriever({
//         k: 6,
//         includeRawContent: true,
//         includeImages: true,
//     });

//     const tavilyRetriever = new ContextualCompressionRetriever({
//         baseCompressor: pipelineCompressor,
//         baseRetriever: baseTavilyRetriever,
//     });

//     // const baseGoogleRetriever = new GoogleCustomSearchRetriever();

//     // const googleRetriever = new ContextualCompressionRetriever({
//     //     baseCompressor: pipelineCompressor,
//     //     baseRetriever: baseGoogleRetriever,
//     // });

//     return tavilyRetriever.withConfig({
//         runName: 'final_source_retriever',
//     });
// };

// const createRetrieverChain = (llm: BaseLanguageModel, retriever: ContextualCompressionRetriever): Runnable => {
//     const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(REPHRASE_TEMPLATE);

//     const condenseQuestionChain = (CONDENSE_QUESTION_PROMPT || llm || StringOutputParser).withConfig({
//         runName: 'condense_question',
//     });

//     const conversationChain = condenseQuestionChain || retriever;

//     return new RunnableBranch(
//         new RunnableLambda({
//             func: (context) => Boolean(context.chatHistory),
//         }).withConfig({
//             runName: 'retrieve_chat_history',
//         })
//     ).withConfig({
//         runName: 'route_depending_on_chat_history',
//     });
// };

// class GoogleCustomSearchRetriever {
//     search = null;
//     number_search_results = 10;

//     cleanSearchQuery(query: string) {
//         // Check if the first character is a digit
//         if (!isNaN(parseInt(query.charAt(0)))) {
//             // Find the position of the first quote
//             let firstQuotePos = query.indexOf('"');
//             if (firstQuotePos !== -1) {
//                 // Extract the part of the string after the quote
//                 query = query.substring(firstQuotePos + 1);
//                 // Remove the trailing quote if present
//                 if (query.endsWith('"')) {
//                     query = query.slice(0, -1);
//                 }
//             }
//         }
//         return query.trim();
//     }

//     searchTool(query: string, num_search_results = 1) {
//         let queryClean = this.cleanSearchQuery(query);
//         let result = this.search.results(queryClean, num_search_results);
//         return result;
//     }

//     async getRelevantDocuments(query, runManager) {
//         if (typeof process.env.GOOGLE_API_KEY === 'undefined') {
//             throw new Error('No Google API key provided');
//         }

//         if (this.search === null) {
//             this.search = new GoogleSearchAPIWrapper();
//         }

//         // Get search questions
//         console.log('Generating questions for Google Search ...');

//         // Get urls
//         console.log('Searching for relevant urls...');
//         let urlsToLook = [];
//         let searchResults = this.searchTool(query, this.num_search_results);
//         console.log('Searching for relevant urls...');
//         console.log(`Search results: ${searchResults}`);
//         searchResults.forEach((res) => {
//             if (res.link) {
//                 urlsToLook.push(res.link);
//             }
//         });

//         console.log(searchResults);
//         let loader = new AsyncHtmlLoader(urlsToLook);
//         let html2text = new Html2TextTransformer();
//         console.log('Indexing new urls...');
//         let docs = await loader.load();
//         docs = html2text.transformDocuments(docs);
//         docs.forEach((doc, i) => {
//             if (searchResults[i].title) {
//                 doc.metadata['title'] = searchResults[i].title;
//             }
//         });
//         return docs;
//     }
// }

// export async function POST(req: Request) {
//     const {
//         messages,
//         model,
//     }: {
//         messages: any[];
//         model: GeneralModel;
//     } = await req.json();

//     const searchResults = await getGoogleSearch(process.env.GOOGLE_SEARCH_API_KEY || '', process.env.GOOGLE_SEARCH_ENGINE_ID || '', messages[0].content);

//     console.log(searchResults);

//     const withPromptMessage = template1(searchResults);

//     const response = await anthropic.messages.create({
//         messages: [
//             {
//                 content: withPromptMessage,
//                 role: 'user',
//             },
//         ],
//         model: model.model_id,
//         stream: true,
//         max_tokens: 4096,
//     });

//     const stream = AnthropicStream(response);

//     return new StreamingTextResponse(stream);
// }

export async function GET(req: Request) {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
}
