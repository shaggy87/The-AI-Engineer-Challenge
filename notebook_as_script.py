import os
import openai
import getpass

os.environ["OPENAI_API_KEY"] = getpass.getpass("Please enter your OpenAI API Key: ")
openai.api_key = os.environ["OPENAI_API_KEY"]
# %%
from openai import OpenAI

client = OpenAI()
# %%
YOUR_PROMPT = "What is the difference between LangChain and LlamaIndex?"

client.chat.completions.create(
    model="gpt-4.1-nano",
    messages=[{"role" : "user", "content" : YOUR_PROMPT}]
)
# %%
from IPython.display import display, Markdown

def get_response(client: OpenAI, messages: str, model: str = "gpt-4.1-nano") -> str:
    return client.chat.completions.create(
        model=model,
        messages=messages
    )

def system_prompt(message: str) -> dict:
    return {"role": "developer", "content": message}

def assistant_prompt(message: str) -> dict:
    return {"role": "assistant", "content": message}

def user_prompt(message: str) -> dict:
    return {"role": "user", "content": message}

def pretty_print(message: str) -> str:
    display(Markdown(message.choices[0].message.content))
# %%
messages = [user_prompt(YOUR_PROMPT)]

chatgpt_response = get_response(client, messages)

pretty_print(chatgpt_response)
# %%
list_of_prompts = [
    system_prompt("You are irate and extremely hungry."),
    user_prompt("Do you prefer crushed ice or cubed ice?")
]

irate_response = get_response(client, list_of_prompts)
pretty_print(irate_response)
# %%
list_of_prompts[0] = system_prompt("You are joyful and having an awesome day!")

joyful_response = get_response(client, list_of_prompts)
pretty_print(joyful_response)
# %%
print(joyful_response)
# %%
list_of_prompts = [
    user_prompt("Please use the words 'stimple' and 'falbean' in a sentence.")
]

stimple_response = get_response(client, list_of_prompts)
pretty_print(stimple_response)
# %%
list_of_prompts = [
    user_prompt("Something that is 'stimple' is said to be good, well functioning, and high quality. An example of a sentence that uses the word 'stimple' is:"),
    assistant_prompt("'Boy, that there is a stimple drill'."),
    user_prompt("A 'falbean' is a tool used to fasten, tighten, or otherwise is a thing that rotates/spins. An example of a sentence that uses the words 'stimple' and 'falbean' is:")
]

stimple_response = get_response(client, list_of_prompts)
pretty_print(stimple_response)
# %%
reasoning_problem = """
Billy wants to get home from San Fran. before 7PM EDT.

It's currently 1PM local time.

Billy can either fly (3hrs), and then take a bus (2hrs), or Billy can take the teleporter (0hrs) and then a bus (1hrs).

Does it matter which travel option Billy selects?
"""

list_of_prompts = [
    user_prompt(reasoning_problem)
]

reasoning_response = get_response(client, list_of_prompts)
pretty_print(reasoning_response)
# %%

list_of_prompts = [
    user_prompt(reasoning_problem + "\nLet's think step by step.")
]

reasoning_response = get_response(client, list_of_prompts)
pretty_print(reasoning_response)
