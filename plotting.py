import matplotlib.pyplot as plt
import seaborn as sns
import circlify
import streamlit as st


def lineplot(df, x, y, title: str):
    fig, ax = plt.subplots(figsize=(6, 4))
    sns.lineplot(
        x=df[x],
        y=df[y],
        data=df,
        hue='Industries',
        ax=ax
    )
    ax.set_xlabel('Year', fontsize=14)
    ax.set_ylabel('Emission (Mt)', fontsize=14)
    ax.set_title(title,
                 loc='left', fontsize=20, fontweight='bold', y=1.05)
    ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.15),
              fancybox=True, shadow=True, ncol=3)
    return st.pyplot(fig, use_container_width=True)


def bubbleplot(df, category, title: str, figx: int, figy: int, labels, fill: str = None, bordercolor: str = 'black'):
    fig, ax = plt.subplots(figsize=(figx, figy))
    ax.axis('off')
    circles = circlify.circlify(
        df[category].sort_values(
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
    ax.set_title(title,
                 loc='center', fontsize=20, fontweight='bold', y=1.05)
    labels = df[labels].tolist()
 
    # print circles
    for circle, label in zip(circles, labels):
        x, y, r = circle
        ax.add_patch(plt.Circle((x, y), r*0.95, alpha=0.3,
                     linewidth=2, facecolor=fill, edgecolor=bordercolor))
        plt.annotate(
            label,
            (x, y),
            va='center',
            ha='center'
        )
    return st.pyplot(fig, use_container_width=True)


def barplot(df, x, y):
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.barh(df[x], df[y])
    ax.set_xlabel("Emission (%)", fontsize=10)
    ax.set_title(f"Canadian {y}\nper Industry Sector",
                 loc='left', fontsize=14, fontweight='bold', y=1.05)
    plt.tight_layout()

    return st.pyplot(fig, use_container_width=True)
