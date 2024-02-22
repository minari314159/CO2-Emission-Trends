
import streamlit as st
import pandas as pd
import circlify
import matplotlib.pyplot as plt
import seaborn as sns
from load_data import load_GHG, load_sector_data, load_CAN_sector


st.set_page_config(
    page_title="Canada's Impact of Green House Gases Sector Analysis",
    page_icon="🇨🇦",
    layout="wide",
    initial_sidebar_state="expanded",
)
pd.set_option('display.float_format', lambda x: '%.1f' % x)
plt.style.use('seaborn-v0_8-pastel')

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
    ['World', 'Asia', 'Africa', 'Oceania', 'Europe', 'North America', 'South America'])].query(
    'Year >= 1900 & Year <= 2020')
continent_options = df_GHG_Con.iloc[:, 0].unique().tolist()

selection = st.sidebar.selectbox(
    label='Choose a Continent',
    options=continent_options)


st.sidebar.subheader('Choose a Green House Gas')
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
df_GHG_Con['Year'] = pd.to_datetime(df_GHG_Con['Year'], format='%Y')
df_GHG_Con = df_GHG_Con.melt(id_vars=['Year', 'Entity'], value_vars=['Agriculture', 'Forestry', 'Waste', 'Buildings', 'Industry',
                                                                     'Manufacturing and Construction', 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'], var_name='Industries', value_name='Emission (Megaton)')
col1, col2 = st.columns(2)

with col2:
    for c in continent_options:
        if selection == c:
            df_plot = df_GHG_Con[df_GHG_Con['Entity'].isin([c])]
            fig, ax = plt.subplots(figsize=(8, 6))
            sns.lineplot(
                x='Year',
                y='Emission (Megaton)',
                data=df_plot,
                hue='Industries',
                ax=ax
            )
            ax.set_xlabel("Year", fontsize=14)
            ax.set_ylabel('Emission (Megaton)', fontsize=14)
            ax.set_title("Greenhouse Gas Emissions\nOver Three Decades",
                         loc='left', fontsize=20, fontweight='bold', y=1.05)
            ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.15),
                      fancybox=True, shadow=True, ncol=3)
            st.pyplot(fig, use_container_width=True)


with col1:
    df_Sector = load_sector_data()
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.axis('off')
    circles = circlify.circlify(
        df_Sector['Share of global greenhouse gas emissions (%)'].sort_values(
            ascending=False).to_list(),
        show_enclosure=False,
        target_enclosure=circlify.Circle(x=0, y=0, r=1)
    )
    # Find axis boundaries
    lim = max(
        max(
            abs(circle.x) + circle.r,
            abs(circle.y) + circle.r,
        )
        for circle in circles
    )
    plt.xlim(-lim, lim)
    plt.ylim(-lim, lim)
    ax.set_title("Proportion of Global\nGHG Emissions per Sector",
                 loc='center', fontsize=20, fontweight='bold', y=1.05)
    labels = df_Sector['Sub-sector']
    # print circles
    for circle, label in zip(circles, labels):
        x, y, r = circle
        ax.add_patch(plt.Circle((x, y), r*0.95, alpha=0.3,
                     linewidth=2, facecolor='#f7768e', edgecolor='#f7768e'))
        plt.annotate(
            label,
            (x, y),
            va='center',
            ha='center'
        )
    st.pyplot(fig, use_container_width=True)

st.divider()

# --------------------------------------------------------------------- #
# Main - Row B

st.subheader("Canada's Greenhouse Gas Emission per Sector")

col1, col2 = st.columns((4, 6))

with col1:
    df_GHG_Can = load_GHG()
    df_GHG_Can = df_GHG_Can.melt(id_vars=['Year', 'Entity'], value_vars=['Agriculture', 'Forestry', 'Waste', 'Buildings', 'Industry', 'Manufacturing and Construction',
                                 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'], var_name='Industries', value_name='Emission (Megaton)')
    df_GHG_Can = df_GHG_Can[df_GHG_Can['Entity'].isin(['Canada'])]

    fig, ax = plt.subplots(figsize=(8, 6))
    sns.lineplot(
        x='Year',
        y='Emission (Megaton)',
        data=df_GHG_Can,
        hue='Industries',
        ax=ax
    )
    ax.set_xlabel("Year", fontsize=14)
    ax.set_ylabel('Emission (Megaton)', fontsize=14)
    ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.15),
              fancybox=True, shadow=True, ncol=3)
    ax.set_title("Canadian Greenhouse Gas\nEmissions Over 3 Decades",
                 loc='left', fontsize=20, fontweight='bold', y=1.05)
    st.pyplot(fig, use_container_width=True)

# All GHG Together
with col2:
    for ghg in ghg_options:
        if choose_GHG == ghg:
            df_All = df_All[['Sub-sector', ghg]]
            fig, ax = plt.subplots(figsize=(6, 4))
            ax.barh(
                df_All['Sub-sector'],
                df_All[ghg],

            )
            ax.set_xlabel("Emission (%)", fontsize=10)
            ax.set_title(
                f"Canadian {ghg}\nper Industry Sector", loc='left', fontsize=14, fontweight='bold', y=1.05)
            plt.tight_layout()
            st.pyplot(fig, use_container_width=True)
