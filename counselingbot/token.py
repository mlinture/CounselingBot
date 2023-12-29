from PyPDF2 import PdfReader
import os

# Path to the PDF file
file_path = 'purdue_catalog.pdf'

def count_tokens_in_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        total_tokens = 0
        for page in reader.pages:
            text = page.extract_text()
            if text:  # Check if text is extracted
                tokens = text.split()
                total_tokens += len(tokens)
        return total_tokens
    except Exception as e:
        return str(e)

# Counting tokens in the provided PDF
token_count = count_tokens_in_pdf(file_path)
token_count

