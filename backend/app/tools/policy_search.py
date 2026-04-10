from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.tools import tool

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001"
)


vector_store = FAISS.load_local("policy_index", embeddings)

@tool 
def search_policy(query: str)-> str:
    """Search HR policy documents for rules, procedures, and guidelines"""
    docs = vector_store.similarity_search(query, k=3)
    return "\n\n".join(d.page_content for d in docs)