from PIL import Image, ImageDraw
from typing import Literal

def is_square(img: Image.Image): 
    width, height = img.size
    if width != height:
        return False
    return True

from PIL import Image, ImageDraw
from typing import Literal

def resize(img: Image.Image, size: Literal["small", "medium", "big", "giant"] = "medium"):
    if size == "small":
        final_size = (128, 128)
    elif size == "medium":
        final_size = (256, 256)
    elif size == "big":
        final_size = (384, 384)
    elif size == "giant":
        final_size = (512, 512)
    return img.resize(final_size)

def make_token(
    img: Image.Image,
    final_size: Literal["small", "medium", "big", "giant"] = "medium",
    border_size: int = 10,
    outline_size: int = 2,
    inner_outline_size: int = 2 
):
    resized_img = resize(img, final_size)
    size = resized_img.size[0]
    transparent_img = resized_img.convert("RGBA")

    circle_mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(circle_mask)
    draw.ellipse((0, 0, size, size), fill=255)

    rounded_img = Image.new("RGBA", (size, size))
    rounded_img.paste(transparent_img, (0, 0), circle_mask)

    final_img_with_border = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(final_img_with_border)

    draw.ellipse((0, 0, size, size), fill=(0, 0, 0, 255))

    color = (183, 154, 117, 255)
    inset_outline = outline_size
    draw.ellipse(
        (
            inset_outline,
            inset_outline,
            size - inset_outline,
            size - inset_outline
        ),
        fill=color
    )

    inset_inner_outline = outline_size + border_size
    draw.ellipse(
        (
            inset_inner_outline,
            inset_inner_outline,
            size - inset_inner_outline,
            size - inset_inner_outline
        ),
        fill=(0, 0, 0, 255)
    )

    inset_total = outline_size + border_size + inner_outline_size
    inner_mask = Image.new("L", (size, size), 0)
    draw_mask = ImageDraw.Draw(inner_mask)
    draw_mask.ellipse(
        (
            inset_total,
            inset_total,
            size - inset_total,
            size - inset_total
        ),
        fill=255
    )

    final_img_with_border.paste(rounded_img, (0, 0), inner_mask)
    return final_img_with_border