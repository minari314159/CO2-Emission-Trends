
import streamlit as st
import pandas as pd
import plost

st.set_page_config(
    page_title="Canada's Impact of Green House Gases Sector Analysis",
    page_icon="🇨🇦",
    layout="wide",
    initial_sidebar_state="expanded",
)
pd.set_option('display.float_format', lambda x: '%.1f' % x)

with open('styles.css') as f:
    st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

df_GHG = pd.read_csv('Data/GHG_Emissions.csv')
df_GHG.rename(columns={
    'Greenhouse gas emissions from agriculture': 'Agriculture',
    'Greenhouse gas emissions from land use change and forestry': 'Forestry',
    'Greenhouse gas emissions from waste': 'Waste',
    'Greenhouse gas emissions from buildings': 'Buildings',
    'Greenhouse gas emissions from industry': 'Industry',
    'Greenhouse gas emissions from manufacturing and construction': 'Manufacturing and Construction',
    'Greenhouse gas emissions from transport': 'Transport',
    'Greenhouse gas emissions from electricity and heat': 'Electricity and Heat',
    'Fugitive emissions of greenhouse gases from energy production': 'Energy Production',
    'Greenhouse gas emissions from other fuel combustion': 'Fuel Combustion',
    'Greenhouse gas emissions from bunker fuels': 'Bunker Fuel'}, inplace=True)

st.sidebar.header('Impact of Green House Gases `Sector Analysis` ')

st.sidebar.caption('Global greenhouse gas emissions continue to rise at a time when they need to be rapidly falling. To effectively reduce emissions, we need to know where they come from  which sectors contribute the most? How can we use this understanding to develop effective solutions and mitigation strategies?')
st.sidebar.caption("This analysis and visualizations will focus on Canada. Canadians generally have the atitude that Canada is a very environmentally friendly country due to its emmense amount of land and nature as well as 'green' government policies. Here these ideas will  be questioned, comparing Canada's emissions to the world's by industrial sector.")

st.sidebar.divider()

st.sidebar.subheader('Continent Selection')
df_compare = df_GHG[df_GHG['Entity'].isin(
    ['World', 'Asia', 'Africa', 'Oceania', 'Europe', 'North America', 'South America'])].drop(['Code'], axis=1)
df_compare = df_compare.query(
    'Year >= 1900 & Year <= 2020')

continent_options = df_compare.iloc[:,0].unique().tolist()
selection = st.sidebar.selectbox(
    label='Choose a Continent', 
    options=continent_options)

st.sidebar.subheader('Year')
year_options = df_compare['Year'].unique().tolist()
year = st.sidebar.select_slider(
    label='Year Range', 
    options=year_options,
    value=(year_options[0],year_options[30]))
st.write(year)

st.sidebar.subheader('Choose a Green House Gas')
choose_GHG = st.sidebar.selectbox('Select data', ('All', 'CO2','CH4','NOx'))

st.sidebar.markdown('''
---
''')
st.sidebar.link_button("<- back to portfolio", url="https://3-d-portfolio-pi.vercel.app", type='secondary')
st.sidebar.markdown('| Created SJ Olsen ')
st.sidebar.markdown('`Data published online at OurWorldInData.org`')

#Row A
st.subheader('Continental Green House Gases Emissions per Sector')


df_compare['Year'] = pd.to_datetime(df_compare['Year'], format='%Y')

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
        create_linechart(df_compare[df_compare['Entity'].isin(['Africa'])])
    elif selection == 'Asia':
        create_linechart(df_compare[df_compare['Entity'].isin(['Asia'])])
    elif selection == 'Europe':
        create_linechart(df_compare[df_compare['Entity'].isin(['Europe'])])
    elif selection == 'North America':
        create_linechart(df_compare[df_compare['Entity'].isin(['North America'])])
    elif selection == 'South America':
        create_linechart(df_compare[df_compare['Entity'].isin(['South America'])])
    elif selection == 'Oceania':
        create_linechart(df_compare[df_compare['Entity'].isin(['Oceania'])])
    else:
        create_linechart(df_compare[df_compare['Entity'].isin(['World'])])


df_Sector = pd.read_csv('Data/Global_GHG_Emissions_by_Sector.csv')

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
#Row B
### Canada's Mean Greenhouse Gas Emission per sector
st.subheader("Canada's Greenhouse Gas Emission per Sector")
col1, col2 = st.columns((4,6))

df_GHG_Can = df_GHG[df_GHG['Entity'].isin(['Canada'])].drop([
    'Code'], axis=1)
df_GHG_Can['Year'] = pd.to_datetime(df_GHG_Can['Year'], format='%Y')
with col2:
    plost.line_chart(
        data=df_GHG_Can,
        x='Year',
        y=('Agriculture', 'Forestry', 'Waste', 'Buildings',
           'Industry', 'Manufacturing and Construction', 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'),
        height=370,
        legend='right',
    )

# # All GHG Together
with col1:
    df_All = pd.read_csv('Data/AllGHG_Can.csv')
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

