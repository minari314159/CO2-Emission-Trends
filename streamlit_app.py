
import streamlit as st
from load_data import load_GHG, load_sector_data, load_CAN_sector
from plotting import lineplot, bubbleplot, barplot


st.set_page_config(
    page_title="Canada's Impact of Green House Gases Sector Analysis",
    page_icon="🇨🇦",
    layout="wide",
    initial_sidebar_state="expanded",
)


with open('styles.css') as f:
    st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

# Side Bar

st.sidebar.header('Impact of Green House Gases `Sector Analysis` ')

st.sidebar.caption('Global greenhouse gas emissions continue to rise at a time when they need to be rapidly falling. To effectively reduce emissions, we need to know where they come from  which sectors contribute the most? How can we use this understanding to develop effective solutions and mitigation strategies?')
st.sidebar.caption("These analysis and visualizations will focus on Canada. Canadians generally have the atitude that Canada is a very environmentally friendly country due to its emmense amount of land and nature as well as 'green' government policies. Here these ideas will  be questioned, comparing Canada's emissions to the world's by industrial sector.")

st.sidebar.divider()

st.sidebar.subheader('Continent Selection')


df_GHG_Con = load_GHG()
df_GHG_Con = df_GHG_Con[df_GHG_Con['Entity'].isin(
    ['World', 'Asia', 'Africa', 'Oceania', 'Europe', 'North America', 'South America'])].query('Year >= 1900 & Year <= 2020')
continent_options = df_GHG_Con.iloc[:, 1].unique().tolist()
selection = st.sidebar.selectbox(
    label='Choose a Continent',
    options=continent_options)

st.sidebar.subheader('Filter Through the Years')
year_options = df_GHG_Con.iloc[:, 0].unique()
choose_year = st.sidebar.slider("Year", 1990, 2020, 2020)

st.sidebar.subheader('Filter Through A Green House Gas')
df_All = load_CAN_sector()
ghg_options = ['CO2 Emission (%)',
               'CH4 Emission (%)', 'NOx Emission (%)']
choose_GHG = st.sidebar.selectbox(
    'Select', ghg_options)

st.sidebar.markdown('''
---
''')
st.sidebar.link_button("<- back to portfolio",
                       url="https://3-d-portfolio-pi.vercel.app", type='secondary')
st.sidebar.markdown('| Created SJ Olsen ')
st.sidebar.markdown('`Data published online at OurWorldInData.org`')

# --------------------------------------------------------------------- #
# Main - Row A

st.subheader('Continental Green House Gas Emissions')

col1, col2 = st.columns(2)


with col2:

    for c in continent_options:
        if selection == c:
            df_plot = df_GHG_Con[df_GHG_Con['Entity'].isin([c])]

            lineplot(df_plot, 'Year', 'Emission (M)',
                     "Greenhouse Gas Emissions\nOver Three Decades")

with col1:
    df_Sector = load_sector_data()
    bubbleplot(df_Sector, 'Share of global greenhouse gas emissions (%)',
               "Proportion of Global\nGHG Emissions per Sector", 8, 8, 'Sub-sector', '#f7768e', '#f7768e')
st.divider()

# --------------------------------------------------------------------- #
# Main - Row B

st.subheader("Canada's Greenhouse Gas Emission per Sector")

col1, col2 = st.columns((1, 1))

with col1:
    df_GHG_Can = load_GHG()
    df_GHG_Can = df_GHG_Can[df_GHG_Can['Entity'].isin(['Canada'])]

    lineplot(df_GHG_Can, 'Year', 'Emission (M)',
             "Canadian Greenhouse Gas\nEmissions Over 3 Decades")

# All GHG Together
with col2:
    for ghg in ghg_options:
        if choose_GHG == ghg:
            df_All = df_All[['Sub-sector', ghg]]
            barplot(df_All, 'Sub-sector', ghg)
