import pandas as pd


def load_GHG():
    """Loads and melts the Greenhouse Gas dataset"""

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
    df_GHG.drop(['Code'], axis=1)

    return df_GHG


def load_sector_data():
    df_Sector = pd.read_csv('Data/Global_GHG_Emissions_by_Sector.csv')

    return df_Sector


def load_CAN_sector():
    df_All = pd.read_csv('Data/AllGHG_Can.csv')
    return df_All
