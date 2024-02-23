import pandas as pd


def load_GHG():
    """Loads and melts the Greenhouse Gas dataset

    Return:
        df_GHG - the cleaned and melted dataset.
    """

    df_GHG = pd.read_csv('Data/GHG_Emissions.csv')

    # Rename the dataframes columns
    df_GHG.rename(columns={
        'Greenhouse gas emissions from agriculture': 'Agriculture',
        'Greenhouse gas emissions from land use change and forestry': 'Forestry',
        'Greenhouse gas emissions from waste': 'Waste',
        'Greenhouse gas emissions from buildings': 'Buildings',
        'Greenhouse gas emissions from industry': 'Industry',
        'Greenhouse gas emissions from manufacturing and construction': 'Manufacturing\nConstruction',
        'Greenhouse gas emissions from transport': 'Transport',
        'Greenhouse gas emissions from electricity and heat': 'Electricity and Heat',
        'Fugitive emissions of greenhouse gases from energy production': 'Energy Production',
        'Greenhouse gas emissions from other fuel combustion': 'Fuel Combustion',
        'Greenhouse gas emissions from bunker fuels': 'Bunker Fuel'}, inplace=True)
    
    #Drops the country code
    df_GHG.drop(['Code'], axis=1, inplace=True)

    #Converts year column to datetime format
    df_GHG['Year'] = pd.to_datetime(df_GHG['Year'], format='%Y')

    #Melts dataframe to long format
    df_GHG = df_GHG.melt(id_vars=['Year', 'Entity'], value_vars=['Agriculture', 'Forestry', 'Waste', 'Buildings', 'Industry',
    'Manufacturing\nConstruction', 'Electricity and Heat', 'Energy Production', 'Fuel Combustion', 'Bunker Fuel'], var_name='Industries', value_name='Emission (M)')

    return df_GHG


def load_sector_data():
    df_Sector = pd.read_csv('Data/Global_GHG_Emissions_by_Sector.csv')

    return df_Sector


def load_CAN_sector():
    df_All = pd.read_csv('Data/AllGHG_Can.csv')
    return df_All
