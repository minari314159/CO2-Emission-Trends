
import streamlit as st
import pandas as pd
import plost
from load_data import load_GHG, load_sector_data, load_CAN_sector


st.set_page_config(
    page_title="Canada's Impact of Green House Gases Sector Analysis",
    page_icon="🇨🇦",
    layout="wide",
    initial_sidebar_state="expanded",
)
pd.set_option('display.float_format', lambda x: '%.1f' % x)

with open('styles.css') as f:
    st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

#Side Bar
    
st.sidebar.header('Impact of Green House Gases `Sector Analysis` ')

st.sidebar.caption('Global greenhouse gas emissions continue to rise at a time when they need to be rapidly falling. To effectively reduce emissions, we need to know where they come from  which sectors contribute the most? How can we use this understanding to develop effective solutions and mitigation strategies?')
st.sidebar.caption("This analysis and visualizations will focus on Canada. Canadians generally have the atitude that Canada is a very environmentally friendly country due to its emmense amount of land and nature as well as 'green' government policies. Here these ideas will  be questioned, comparing Canada's emissions to the world's by industrial sector.")

st.sidebar.divider()

st.sidebar.subheader('Continent Selection')

df_GHG_Con = load_GHG()
df_GHG_Con = df_GHG_Con[df_GHG_Con['Entity'].isin(
    ['World', 'Asia', 'Africa', 'Oceania', 'Europe', 'North America', 'South America'])].query(
    'Year >= 1900 & Year <= 2020')
continent_options = df_GHG_Con.iloc[:,0].unique().tolist()

selection = st.sidebar.selectbox(
    label='Choose a Continent', 
    options=continent_options)

st.sidebar.subheader('Year')
year_options = df_GHG_Con['Year'].unique().tolist()
year = st.sidebar.select_slider(
    label='Year Range', 
    options=year_options,
    value=(year_options[0],year_options[30]))


st.sidebar.subheader('Choose a Green House Gas')
choose_GHG = st.sidebar.selectbox('Select data', ('All', 'CO2','CH4','NOx'))

st.sidebar.markdown('''
---
''')
st.sidebar.link_button("<- back to portfolio", url="https://3-d-portfolio-pi.vercel.app", type='secondary')
st.sidebar.markdown('| Created SJ Olsen ')
st.sidebar.markdown('`Data published online at OurWorldInData.org`')

# --------------------------------------------------------------------- #
#Main - Row A

st.subheader('Continental Green House Gases Emissions per Sector')
df_GHG_Con['Year'] = pd.to_datetime(df_GHG_Con['Year'], format='%Y')
col1,col2 = st.columns(2)

with col1:
    def create_linechart(data):
        plost.line_chart(
            data=data,
            x='Year',
            y=('Agriculture', 'Forestry', 'Waste', 'Buildings',
                    'Industry', 'Manufacturing and Construction', 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'),
            legend=None,
            height=400,
            use_container_width=True
        )

    
    if selection == 'Africa':
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['Africa'])])
    elif selection == 'Asia':
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['Asia'])])
    elif selection == 'Europe':
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['Europe'])])
    elif selection == 'North America':
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['North America'])])
    elif selection == 'South America':
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['South America'])])
    elif selection == 'Oceania':
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['Oceania'])])
    else:
        create_linechart(df_GHG_Con[df_GHG_Con['Entity'].isin(['World'])])


df_Sector = load_sector_data()

with col2:
    st.metric("Global Temperature Record `2023`", "14.98 °C", "0.17 °C", delta_color='inverse')

    plost.pie_chart(
        data=df_Sector,
        theta='Share of global greenhouse gas emissions (%)',
        color='Sub-sector',
        legend='right',
        height=290,
        use_container_width=True)

st.divider()

# --------------------------------------------------------------------- #
#Main - Row B

st.subheader("Canada's Greenhouse Gas Emission per Sector")

col1, col2 = st.columns((4,6))

with col2:
    df_GHG_Can = load_GHG()
    df_GHG_Can = df_GHG_Can[df_GHG_Can['Entity'].isin(['Canada'])]
    df_GHG_Can['Year'] = pd.to_datetime(df_GHG_Can['Year'], format='%Y')

    plost.line_chart(
        data=df_GHG_Can,
        x='Year',
        y=('Agriculture', 'Forestry', 'Waste', 'Buildings',
           'Industry', 'Manufacturing and Construction', 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'),
        height=370,
        legend='right',
        use_container_width=True
    )

# All GHG Together
with col1:

    df_All = load_CAN_sector()
    palette = ['#b5838d', '#84a59d', '#f28482']
    
    def create_bar_chart(value,color=None):
        plost.bar_chart(
            data=df_All,
            bar='Sub-sector',
            value=value,
            direction='horizontal',
            legend='bottom',
            height=400,
            color=color,
            use_container_width=True
        )

    if choose_GHG == 'CO2':
        create_bar_chart('CO2 Emission (%)',palette[0])
    elif choose_GHG == 'CH4':
        create_bar_chart('CH4 Emission (%)', palette[1])
    elif choose_GHG == 'NOx':
        create_bar_chart('NOx Emission (%)', palette[2])
    else:
       create_bar_chart(
           ['CO2 Emission (%)', 'CH4 Emission (%)', 'NOx Emission (%)'])

