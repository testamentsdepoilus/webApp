from bs4 import BeautifulSoup
from bs4 import NavigableString
from bs4 import Comment
import json


def wrap_ul(tags):
    all_li = tags.find_all("li")
    if len(all_li) > 0 and all_li[0].parent.name != "ul":
        ul = BeautifulSoup(features="html.parser").new_tag('ul')
        all_li[0].insert_before(ul)
        for li in all_li:
            if li.parent.name != "ul":
                ul.append(li)


def parse_paragraph(tag, tags, page_div, output, type_class, prev_tags):
    if tag.parent.name and tag.parent.name != "div":
        new_element = dict()
        new_element[tag.parent.name] = []
        if isinstance(tag, NavigableString) and tag.string != "\n":
            new_element[tag.parent.name].append(tag.string)
        prev_tags.insert(0, new_element)
    if tag is not None and tag.name is not None:
        if tag.get('class') == "pb":
            if len(prev_tags) > 0:
                for i in range(len(prev_tags) - 1):
                    for key in prev_tags[i].keys():
                        new_tag = BeautifulSoup(
                            features="html.parser").new_tag(key)
                        new_tag.extend(prev_tags[i][key])
                        for key_bis in prev_tags[i + 1].keys():
                            prev_tags[i + 1][key_bis].append(new_tag)
                for key in prev_tags[len(prev_tags) - 1].keys():
                    new_tag = BeautifulSoup(
                        features="html.parser").new_tag(key)
                    new_tag.extend(prev_tags[len(prev_tags) - 1][key])
                    tags.append(new_tag)
                    prev_tags = []
            page_div.extend(tags)
            for element in page_div(text=lambda it: isinstance(it, Comment)):
                element.extract()
            wrap_ul(page_div)
            output.append(str(page_div))
            tags = []
            page_div = BeautifulSoup(features="html.parser").new_tag('div')
            page_div.attrs = {"id": tag.get('id'), "class": type_class}

    for item in tag.next_siblings:
        if item is not None and item.name is not None:
            if item.get('class') == "pb":
                # print(prev_tags)
                # print("***************************************")
                if len(prev_tags) > 0:
                    for i in range(len(prev_tags)-1):
                        for key in prev_tags[i].keys():
                            new_tag = BeautifulSoup(
                                features="html.parser").new_tag(key)
                            new_tag.extend(prev_tags[i][key])
                            for key_bis in prev_tags[i+1].keys():
                                prev_tags[i+1][key_bis].append(new_tag)
                    for key in prev_tags[len(prev_tags)-1].keys():
                        new_tag = BeautifulSoup(
                            features="html.parser").new_tag(key)
                        new_tag.extend(prev_tags[len(prev_tags) - 1][key])
                        tags.append(new_tag)
                        prev_tags = []
                page_div.extend(tags)
                for element in page_div(text=lambda it: isinstance(it, Comment)):
                    element.extract()

                output.append(str(page_div))
                tags = []
                page_div = BeautifulSoup(features="html.parser").new_tag('div')
                page_div.attrs = {"id": item.get('id'), "class": type_class}
            elif item.find("div", {"class": "pb"}) is not None:
                [tags, page_div, output, prev_tags] = parse_paragraph(
                    item.next_element, tags, page_div, output, type_class, prev_tags)
            else:
                if len(prev_tags) == 0:
                    tags.append(item)
                else:
                    if tag.parent.name in prev_tags[0]:
                        prev_tags[0][tag.parent.name].append(item)

        else:
            if len(prev_tags) == 0:
                tags.append(item)
            else:
                if tag.parent.name in prev_tags[0]:
                    prev_tags[0][tag.parent.name].append(item)

    return [tags, page_div, output, prev_tags]


def edition(file_tei, config_file):
    add_translate = {"above": "au dessus", "below": "au dessous", "marginLeft": "en marge à gauche",
                     "marginRight": "en marge à droite", "marginBottom": "en marge inférieur", "marginTop": "en marge supérieur", "inline": "dans la ligne"}

    with open(config_file) as json_file:
        config = json.load(json_file)
    with open(file_tei, encoding='utf8') as fp:
        soup = BeautifulSoup(fp, "lxml-xml")
    body = soup.find('body')
    for x, y in config['tags'].items():
        for tag in y:
            for node in body.find_all(tag):
                if node.name in ["sic", "abbr", "note", "space", "del"]:
                    # if node.name in ["lb", "space"]:
                    # 	if node.name == "lb" and isinstance(node.previous_sibling, NavigableString):
                    # 		str_ = node.previous_sibling.strip()
                    # 		if len(str_) == 0 or str_[len(str_)-1] != '-':
                    # 			space = BeautifulSoup(features="html.parser").new_tag('span')
                    # 			space.attrs = {"class": node.name + "-edition"}
                    # 			space.string = "  "
                    # 			node.insert_after(space)
                    # 		else:
                    # 			node.previous_sibling.replace_with(str_.replace('-', ''))
                    node.decompose()
                else:
                    # if node.name in ["persName", "item", "placeName", "date", "addrLine", "surname"]:
                    #     node.insert(0, "")
                    #     # if node.name == "persName" :
                    #     # 	node.next_element.next_element.insert_after(" ")
                    #     next_str = node.parent.next_sibling
                    #     # if next_str is not None and len(next_str) > 1 and next_str[0] not in [".", ","]:
                    #     #     node.insert(len(node.contents), "")

                    # elif node.name in ["expan"] and node.string is not None:
                    #     node.string = "" + node.string + ""
                    new_attrs = dict()
                    new_attrs['class'] = tag
                    for old_attr in node.attrs:
                        if old_attr in config['attrs']:
                            new_attrs['class'] += "-" + node.attrs[old_attr]
                        if old_attr == "xml:lang":
                            new_attrs["xml:lang"] = node.get("xml:lang")
                        elif old_attr == "facs":
                            new_attrs["id"] = node.attrs[old_attr]
                    if "rend" in node.attrs:
                        new_attrs['class'] += "-" + node.attrs["rend"]
                    if node.name == "unclear":
                        new_attrs['title'] = "transcription incertaine"
                    if node.name == "add":
                        if 'place' in node.attrs:
                            new_attrs['title'] = "ajout " + \
                                add_translate[node['place']]
                            # new_attrs['class'] = "add-" + node['place']
                            # node.insert(0, "\\")
                            # node.insert(len(node.contents), "/ ")
                    elif node.name == "supplied":
                        node.insert(0, "{")
                        node.insert(len(node.contents), "}")
                    node.name = x
                    node.attrs = new_attrs
                    if len(node.contents) == 0 and node.name == "span":
                        node.string = ""

    # for node in body.find_all("p"):
    # 	node.insert(0, " ")
    # 	node.insert(len(node.contents), " ")
    output = {"will": [], "envelope": [], "codicil": []}
    output_div = []
    for item in body.find_all("div"):
        if item.has_attr('type') and item['type'] in output.keys():
            output_div.append(item)

    for item in output_div:
        page = item.find("div", {"class": "pb"})
        page_div = BeautifulSoup(features="html.parser").new_tag("div")
        page_div.attrs = {"id": page['id'], "class": "edition"}
        page_div.append("")
        tags = []
        output_ = []
        prev_tags = []
        for tag in page.next_siblings:
            if tag is not None and tag.name is not None:
                if tag.get('class') == "pb":
                    page_div.extend(tags)
                    #  Traitement partie commentaire <!-- -->
                    for element in page_div(text=lambda it: isinstance(it, Comment)):
                        element.extract()
                    wrap_ul(page_div)
                    output_.append(str(page_div))
                    tags = []
                    page_div = BeautifulSoup(
                        features="html.parser").new_tag('div')
                    page_div.attrs = {"id": tag.get('id'), "class": "edition"}
                elif tag.find("div", {"class": "pb"}) is not None:
                    [tags, page_div, output_, prev_tags] = parse_paragraph(
                        tag.next_element, tags, page_div, output_, "edition", prev_tags)
                elif tag.name == "p":
                    for element in tags:
                        if element not in ['\n', ' '] and element.name is not None:
                            if element.name != "p":
                                new_tag = BeautifulSoup(
                                    features="html.parser").new_tag('p')
                                new_tag.extend(tags)
                                tags.clear()
                                tags.append(new_tag)
                                break
                    tags.append(tag)
                else:
                    tags.append(tag)

        page_div.extend(tags)
        # for comment in page_div.find_all(string=lambda text: isinstance(text, Comment)):
        #	comment_soup = BeautifulSoup(comment, "html.parser")
        #	for x, y in config['tags'].items():
        #		y_lower = [x.lower() for x in y]
        #		for tag in y_lower:
        #			for node in comment_soup.find_all(tag):
        #				convertTag(node, x, y[y_lower.index(tag)], config)
        #	comment.replace_with(Comment(str(comment_soup)))

        # Traitement attr @rend pour <p>
        for node_p in page_div.find_all("p"):
            if node_p.has_attr('rend'):
                node_p.attrs = {"class": "p-" + node_p["rend"]}

        #  Traitement partie commentaire <!-- -->
        for element in page_div(text=lambda it: isinstance(it, Comment)):
            element.extract()
        wrap_ul(page_div)
        output_.append(str(page_div))
        output[item['type']] = output_
    return output


def transcription(file_tei, config_file):
    with open(config_file) as json_file:
        config = json.load(json_file)
    with open(file_tei, encoding='utf8') as fp:
        soup = BeautifulSoup(fp, "lxml-xml")
    body = soup.find('body')
    for x, y in config['tags'].items():
        for tag in y:
            for node in body.find_all(tag):
                convertTag(node, x, tag, config)

    # for node in body.find_all("p"):
    # 	node.insert(0, " ")
    # 	node.insert(len(node.contents), " ")
    output = {"will": [], "envelope": [], "codicil": []}
    output_div = []
    for item in body.find_all("div"):
        if item.has_attr('type') and item['type'] in output.keys():
            output_div.append(item)

    for item in output_div:
        page = item.find("div", {"class": "pb"})
        page_div = BeautifulSoup(features="html.parser").new_tag('div')
        page_div.attrs = {"id": page['id'], "class": "transcription"}
        page_div.append("")
        output_ = []
        tags = []
        prev_tags = []
        for tag in page.next_siblings:
            if tag is not None and tag.name is not None:
                if tag.get('class') == "pb":
                    page_div.extend(tags)
                    #  Traitement partie commentaire <!-- -->
                    for element in page_div(text=lambda it: isinstance(it, Comment)):
                        element.extract()
                    wrap_ul(page_div)
                    output_.append(str(page_div))
                    tags = []
                    page_div = BeautifulSoup(
                        features="html.parser").new_tag('div')
                    page_div.attrs = {
                        "id": tag['id'], "class": "transcription"}
                elif tag.find("div", {"class": "pb"}) is not None:
                    [tags, page_div, output_, prev_tags] = parse_paragraph(
                        tag.next_element, tags, page_div, output_, "transcription", prev_tags)
                elif tag.name == "p":
                    # tags = list(filter(lambda a: a != '\n', tags))
                    for element in tags:
                        if element not in ['\n', ' '] and element.name is not None:
                            if element.name != "p":
                                new_tag = BeautifulSoup(
                                    features="html.parser").new_tag('p')
                                new_tag.extend(tags)
                                tags.clear()
                                tags.append(new_tag)
                                break
                    tags.append(tag)
                else:
                    tags.append(tag)

        page_div.extend(tags)

        # Traitement attr @rend pour <p>
        for node_p in page_div.find_all("p"):
            if node_p.has_attr('rend'):
                node_p.attrs = {"class": "p-"+node_p["rend"]}
        #  Traitement partie commentaire <!-- -->
        for element in page_div(text=lambda it: isinstance(it, Comment)):
            element.extract()
            # comment_soup = BeautifulSoup(comment, "html.parser")
            # for x, y in config['tags'].items():
            # y_lower = [x.lower() for x in y]
            # for tag in y_lower:
            # for node in comment_soup.find_all(tag):
            # convertTag(node, x, y[y_lower.index(tag)], config)
            # comment.replace_with(Comment(str(comment_soup)))

        wrap_ul(page_div)
        output_.append(str(page_div))
        output[item['type']] = output_

    return output


def convertTag(node, x, tag, config):
    add_translate = {"above": "au dessus", "below": "au dessous", "marginLeft": "en marge à gauche", "marginRight": "en marge à droite",
                     "marginBottom": "en marge inférieur", "marginTop": "en marge supérieur", "inline": "dans la ligne"}

    if node.name in ["sic", "abbr"]:
        # if node.string is not None:
        #     node.string.insert_before("[")
        #     new_str = NavigableString("]")
        #     node.append(new_str)
        # else:
        node.insert(0, "[")
        node.insert(len(node.contents), "]")
    elif node.name == "corr":
        if node.get_text() == "":
            node.extract()
        else:
            node.insert(len(node.contents), "")
    # elif node.name == "lem":
    # 	if node.string is not None:
    # 		node.string.insert_before("{")
    # 		new_str = NavigableString("}")
    # 		node.append(new_str)
    # 	else:
    # 		node.insert(0, "{")
    # 		node.insert(len(node.contents), "}")
    # elif node.name in ["persName", "item", "placeName", "date", "addrLine", "surname"]:
    #     node.insert(0, "")
    #     # if node.name == "persName":
    #     # 	node.next_element.next_element.insert_after(" ")
    # node.next_element.insert_before("\\")
    # node.next_element.next_element.insert_after("/")

    elif node.name == "space":
        if node.parent.name == "body":
            space = BeautifulSoup(features="html.parser").new_tag('div')
            space["class"] = node.name
            for old_attr in node.attrs:
                if old_attr in config["attrs"]:
                    space.attrs["class"] += "-" + node.attrs[old_attr]
        else:
            space = BeautifulSoup(features="html.parser").new_tag('span')
            space.attrs["class"] = tag
            for old_attr in node.attrs:
                if old_attr in config["attrs"]:
                    space.attrs["class"] += "-" + node.attrs[old_attr]
        node.insert_after(space)
        node.extract()

    elif node.name == "lb":
        if "break" in node.attrs and node["break"] == "no":
            node.insert_before("-")
        # Traitmenet br add <i> tag
        i_tag = BeautifulSoup(features="html.parser").new_tag('i')
        i_tag.attrs["aria-hidden"] = "true"
        i_tag.attrs["class"] = "fas fa-level-down-alt"
        node.insert_before(i_tag)

    new_attrs = dict()
    new_attrs['class'] = tag
    for old_attr in node.attrs:
        if old_attr in config["attrs"]:
            new_attrs['class'] += "-" + node.attrs[old_attr]
        if old_attr == "xml:lang":
            new_attrs["xml:lang"] = node.get("xml:lang")
        elif old_attr == "facs":
            new_attrs["id"] = node.attrs[old_attr]

    if "rend" in node.attrs:
        new_attrs['class'] += "-" + node.attrs["rend"]
    if node.name == "unclear":
        node.insert(0, "|")
        node.insert(len(node.contents), "|")
    elif node.name == "add":
        if 'place' in node.attrs:
            #new_attrs['title'] = "ajout " + add_translate[node['place']]
            # new_attrs['class'] = "add-" + node['place']
            # node.next_element.insert_before("\\")
            # node.next_element.next_element.insert_after("/")
            node.insert(0, "\\")
            node.insert(len(node.contents), "/ ")
    elif node.name == "note":
        node.insert(len(node.contents),
                    " (auteur de cette note : "+node.attrs["resp"] + ")")
        new_attrs['class'] += "-" + node.parent.name
    elif node.name == "supplied":
        node.insert(0, "{")
        node.insert(len(node.contents), "}")
    elif  node.name == "surplus":
        node.insert(0, "+")
        node.insert(len(node.contents), "+")
    node.name = x
    node.attrs = new_attrs

    if len(node.contents) == 0 and node.name == "span":
        node.string = ""


if __name__ == "__main__":
    fileTei = "/home/adoula/Downloads/will_AN_0125.xml"
    configFile = 'config.json'
    revised = transcription(fileTei, configFile)
    # edit_soup = BeautifulSoup(revised['will'][0], 'html.parser')
    # print("***********************")
    print(revised['will'][1])
    # print("*****************")
    # print(edit_soup.get_text())
