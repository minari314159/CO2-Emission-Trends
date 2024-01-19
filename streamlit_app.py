from streamlit_jupyter import StreamlitPatcher
import seaborn as sns
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd
import plost

st.set_page_config(layout='wide')
StreamlitPatcher().jupyter()

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 500)
pd.set_option('display.float_format', lambda x: '%.1f' % x)

with open('styles.css') as f:
    st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

st.sidebar.header('DashBoard ')
st.sidebar.link_button("<- back to portfolio",
               url="https://3-d-portfolio-pi.vercel.app", type='secondary')

st.sidebar.subheader('Year')
year_slider = st.sidebar.slider('Year', 1990, 2020, 2020)



st.sidebar.markdown('''
---
Created SJ Olsen.
''')

st.markdown('### Impact Analysis of Canadian Green House Gases by Sector')

#Row A
st.markdown('#### Global GHG per Sector')

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

df_compare = df_GHG[df_GHG['Entity'].isin(
    ['World'])]
df_compare = df_compare.drop(['Code'], axis=1).query(
    'Year >= 1900 & Year <= 2020')
cols = df_compare.iloc[:, 3:]
plost.line_chart(
    data=df_compare,
    x='Year',
    y=('Agriculture', 'Forestry', 'Waste', 'Buildings',
            'Industry', 'Manufacturing and Construction', 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'),
    width=600,
    legend='top',
    pan_zoom='minimap',
    use_container_width=True
)
    

### Canada's Mean Greenhouse Gas Emission per sector
st.markdown("#### Canada's Mean Greenhouse Gas Emission per sector")

df_GHG_Can = df_GHG[df_GHG['Entity'].isin(['Canada'])].drop([
    'Code'], axis=1)


# +
GHG_y = df_GHG_Can.iloc[:, 2:]

fig, ax = plt.subplots(figsize=(15, 8))

ax.plot(df_GHG_Can['Year'], GHG_y)
fig.autofmt_xdate(which='both')

ax.set_title('Canadian Green House Gas Emission per Sector')
ax.set_ylabel('Green House Gas Emission (Tonnes)')
ax.set_xlabel('Year')
ax.legend(['Agriculture', 'Forestry',
           'Waste',
           'Buildings',
           'Industry',
           'Manufacturing and Construction',
           'Transport',
           'Electricity and Heat',
           'Energy Production',
           'Fuel Combustion',
           'Bunker Fuel'])
plt.tight_layout()
plt.show()
# -

# ### Create Selector Button

# ### Current Greenhouse Gase Emission Per Sector

df_Current = df_GHG_Can.query('Year == 2020')
df_Current = df_Current.drop(
    ['Entity', 'Year'], axis=1).transpose().reset_index()
df_Current = df_Current.rename(
    columns={'index': 'Sub-sector', 1022: 'GHG Emission (Tonnes)'})
df_Current["GHG Emission (%)"] = (
    (df_Current['GHG Emission (Tonnes)']/sum(df_Current['GHG Emission (Tonnes)']))*100)
df_Current = df_Current.interactive()

# +

GHG_y = df_Current['GHG Emission (%)']
sub_sector = df_Current['Sub-sector']

plt.barh(sub_sector, GHG_y, label='All Sectors', color=pal[5])

plt.title("Impact of Canadian Green House Gases per Sector")
plt.xlabel('Green House Gas Emission (%)')
plt.tight_layout()
plt.show()
# -

# ### Methane Emissions of Canada per Sector

df_CH4 = pd.read_csv('Data/CH4_Emissions.csv')
df_CH4_Can = df_CH4[df_CH4['Entity'].isin(['Canada'])].drop(
    ['Code'], axis=1).query('Year >= 1900 & Year <= 2020')
df_CH4_Can.rename(columns={
    'Methane emissions from agriculture': 'Agriculture',
    'Fugitive emissions of methane from energy production': 'Energy Production',
    'Methane emissions from waste': 'Waste',
    'Methane emissions from land use change and forestry': 'Forestry',
    'Methane emissions from other fuel combustion': 'Fuel Combustion',
    'Methane emissions from industry': 'Industry'}, inplace=True)



# +
CH4_y = df_CH4_Can.iloc[:, 2:]

fig, ax = plt.subplots(figsize=(15, 8))

ax.plot(df_CH4_Can['Year'], CH4_y)
fig.autofmt_xdate(which='both')

ax.set_title('Canadian Methane Gas Emission per Sector')
ax.set_ylabel('Methane Gas Emission (Tonnes)')
ax.set_xlabel('Year')
ax.legend(['Agriculture', 'Forestry',
           'Waste',
           'Buildings',
           'Industry',
           'Manufacturing and Construction',
           'Transport',
           'Electricity and Heat',
           'Energy Production',
           'Fuel Combustion',
           'Bunker Fuel'])
plt.tight_layout()
plt.show()
# -

# ### Current Methan Emissions (2020)

# +

df_Current2 = df_CH4_Can.query('Year == 2020')
df_Current2 = df_Current2.drop(
    ['Entity', 'Year'], axis=1).transpose().reset_index()
df_Current2 = df_Current2.rename(
    columns={'index': 'Sub-sector', 1022: 'CH4 Emission (Tonnes)'})
df_Current2["CH4 Emission (%)"] = (df_Current2['CH4 Emission (Tonnes)'] /
                                   sum(df_Current2['CH4 Emission (Tonnes)'])*100)
df_Current2 = df_Current2.sort_values(by='CH4 Emission (%)')
df_Current2

# +
CH4_y = df_Current2['CH4 Emission (%)']
sub_sector = df_Current2['Sub-sector']

plt.barh(sub_sector, CH4_y, label='All Sectors', color=pal[5])

plt.title("Impact of Canadian Methan Emission per Sector")
plt.xlabel('Methane Emission (Tonnes)')
plt.tight_layout()
plt.show()
# -

# ## CO2 Emission of Canada per Sector

df_CO2 = pd.read_csv('Data/CO2_Emission.csv')
df_CO2_Can = df_CO2[df_CO2['Entity'].isin(['Canada'])].drop(
    ['Code'], axis=1).query('Year >= 1900 & Year <= 2020')
df_CO2_Can.rename(columns={
    'Carbon dioxide emissions from buildings': 'Buildings',
    'Carbon dioxide emissions from industry': 'Industry',
    'Carbon dioxide emissions from land use change and forestry': 'Forestry',
    'Carbon dioxide emissions from other fuel combustion': 'Fuel Combustion',
    'Carbon dioxide emissions from transport': 'Transport',
    'Carbon dioxide emissions from manufacturing and construction': 'Manufacturing & Construction',
    'Fugitive emissions of carbon dioxide from energy production': 'Energy Production',
    'Carbon dioxide emissions from electricity and heat': 'Electricity & Heat'}, inplace=True)


# +
CO2_y = df_CO2_Can.iloc[:, 2:]

fig, ax = plt.subplots(figsize=(15, 8))

ax.plot(df_CO2_Can['Year'], CO2_y)
fig.autofmt_xdate(which='both')

ax.set_title('Canadian Carbon Dioxide Gas Emission per Sector')
ax.set_ylabel('CO2 Gas Emission (Tonnes)')
ax.set_xlabel('Year')
ax.legend(['Buildings', 'Industry',
           'Forestry',
           'Fuel Combustion',
           'Transport',
           'Manufacturing & Construction',
           'Energy Production',
           'Electricity & Heat'])
plt.tight_layout()
plt.show()
# -

# ### Current CO2 Emissions (2020)

# +

df_Current3 = df_CO2_Can.query('Year == 2020')
df_Current3 = df_Current3.drop(
    ['Entity', 'Year'], axis=1).transpose().reset_index()
df_Current3 = df_Current3.rename(
    columns={'index': 'Sub-sector', 1022: 'CO2 Emission (Tonnes)'})
df_Current3["CO2 Emission (%)"] = (df_Current3['CO2 Emission (Tonnes)'] /
                                   sum(df_Current3['CO2 Emission (Tonnes)'])*100)
df_Current3 = df_Current3.sort_values(by='CO2 Emission (%)')


# +
CO2_y = df_Current3['CO2 Emission (%)']
sub_sector = df_Current3['Sub-sector']

plt.barh(sub_sector, CO2_y, label='All Sectors', color=pal[5])

plt.title("Impact of Canadian Carbon Dioxide Emission per Sector")
plt.xlabel('CO2 Emission (%)')
plt.tight_layout()
plt.show()
# -

# # Nitrous Oxide (NOx) Emission of Canada per Sector

df_NOx = pd.read_csv('Data/NOx_Emissions.csv')
df_NOx_Can = df_NOx[df_NOx['Entity'].isin(['Canada'])].drop(
    ['Code'], axis=1).query('Year >= 1900 & Year <= 2020')
df_NOx_Can.rename(columns={
    'Nitrous oxide emissions from agriculture': 'Agriculture',
    'Nitrous oxide emissions from industry': 'Industry',
    'Nitrous oxide emissions from other fuel combustion': 'Fuel Combustion',
    'Nitrous oxide emissions from waste': 'Waste',
    'Nitrous oxide emissions from land use change and forestry': 'Forestry',
    'Fugitive emissions of nitrous oxide from energy production': 'Energy Production'}, inplace=True)


# +
NOx_y = df_NOx_Can.iloc[:, 2:]

fig, ax = plt.subplots(figsize=(15, 8))

ax.plot(df_NOx_Can['Year'], NOx_y)
fig.autofmt_xdate(which='both')

ax.set_title('Canadian Nitrous Oxides Emission per Sector')
ax.set_ylabel('NOx Gas Emission (Tonnes)')
ax.set_xlabel('Year')
ax.legend(['Agriculture', 'Industry',
           'Fuel Combustion',
           'Waste',
           'Forestry',
           'Energy Production',
           ])
plt.tight_layout()
plt.show()
# -

# ### Current NOx Emission (2020)

df_Current4 = df_NOx_Can.query('Year == 2020')
df_Current4 = df_Current4.drop(
    ['Entity', 'Year'], axis=1).transpose().reset_index()
df_Current4 = df_Current4.rename(
    columns={'index': 'Sub-sector', 1022: 'NOx Emission (Tonnes)'})
df_Current4["NOx Emission (%)"] = (df_Current4['NOx Emission (Tonnes)'] /
                                   sum(df_Current4['NOx Emission (Tonnes)'])*100)
df_Current4 = df_Current4.sort_values(by='NOx Emission (%)')


# +
NOx_y = df_Current4['NOx Emission (%)']
sub_sector = df_Current4['Sub-sector']

plt.barh(sub_sector, NOx_y, label='All Sectors', color=pal[5])

plt.title("Impact of Canadian Nitrous Oxides Emission per Sector")
plt.xlabel('NOx Emission (%)')
plt.tight_layout()
plt.show()
# -

# # All GHG Together

# +

frames = [df_Current2, df_Current3, df_Current4]
df_All = pd.merge(pd.merge(df_Current2, df_Current3, how='outer',
                  on='Sub-sector'), df_Current4, how='outer', on='Sub-sector').fillna(0)
df_All = df_All.sort_values(by='Sub-sector')
df_All

# +
sub_sector = df_All['Sub-sector']

plt.barh(sub_sector, df_All['CO2 Emission (%)'],
         label='CO2 Emissions', color=pal[3])
plt.barh(sub_sector, df_All['NOx Emission (%)'],
         label='NOx Emissions', color=pal[1])
plt.barh(sub_sector, df_All['CH4 Emission (%)'],
         label='CH4 Emissions', color=pal[5])

plt.title("Impact of Canadian Emission per Sector")
plt.xlabel('GHG Emission (%)')
plt.legend()
plt.tight_layout()
plt.show()
# -

# ### Comparison to the World
